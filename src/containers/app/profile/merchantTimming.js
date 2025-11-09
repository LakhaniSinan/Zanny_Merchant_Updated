import React, { use, useCallback, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { colors } from "../../../constants";
import Button from "../../../components/button";
import Header from "../../../components/header";
import { updateMerchantProfile } from "../../../services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OverLayLoader from "../../../components/loader";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/slices/Login";
import { useFocusEffect } from "@react-navigation/native";

const MerchantTimings = ({ route }) => {

    console.log(route, "routerouteroute");
    const dispatch = useDispatch()
    const { data } = route.params
    const [isLoading, setIsLoading] = React.useState(false)
    const [weeklyHours, setWeeklyHours] = useState([
        { day: "Monday", start: null, end: null, enabled: false },
        { day: "Tuesday", start: null, end: null, enabled: false },
        { day: "Wednesday", start: null, end: null, enabled: false },
        { day: "Thursday", start: null, end: null, enabled: false },
        { day: "Friday", start: null, end: null, enabled: false },
        { day: "Saturday", start: null, end: null, enabled: false },
        { day: "Sunday", start: null, end: null, enabled: false },
    ]);

    useFocusEffect(
        useCallback(() => {
            if (data?.merchantTimmings && Array.isArray(data.merchantTimmings)) {
                const defaults = [
                    { day: "Monday", start: null, end: null, enabled: false },
                    { day: "Tuesday", start: null, end: null, enabled: false },
                    { day: "Wednesday", start: null, end: null, enabled: false },
                    { day: "Thursday", start: null, end: null, enabled: false },
                    { day: "Friday", start: null, end: null, enabled: false },
                    { day: "Saturday", start: null, end: null, enabled: false },
                    { day: "Sunday", start: null, end: null, enabled: false },
                ];

                const merged = defaults.map((def) => {
                    const saved = data.merchantTimmings.find((t) => t.day === def.day);
                    return saved ? { ...def, ...saved } : def;
                });

                setWeeklyHours(merged);
            }
        }, [data])
    );

    const [showPicker, setShowPicker] = useState(false);
    const [pickerIndex, setPickerIndex] = useState(null);
    const [pickerIsStart, setPickerIsStart] = useState(true);
    const [pickerValue, setPickerValue] = useState(new Date());

    // open picker and set initial value (so AM/PM is obvious)
    const openPicker = (index, isStart) => {
        setPickerIndex(index);
        setPickerIsStart(isStart);

        // if there is already selected time, use it as initial value
        const timeStr = isStart ? weeklyHours[index].start : weeklyHours[index].end;
        if (timeStr) {
            // create Date object for today with that HH:mm
            const [hh, mm] = timeStr.split(":").map(Number);
            const d = new Date();
            d.setHours(hh, mm, 0, 0);
            setPickerValue(d);
        } else {
            setPickerValue(new Date());
        }

        setShowPicker(true);
    };

    // helper to get a moment for "today" + HH:mm
    const timeStringToMomentToday = (hhmm) => {
        if (!hhmm) return null;
        const [hh, mm] = hhmm.split(":").map(Number);
        return moment().hour(hh).minute(mm).second(0).millisecond(0);
    };

    const onTimeSelected = (event, selectedDate) => {
        // hide picker
        setShowPicker(false);

        // on Android cancel -> selectedDate == undefined
        if (!selectedDate) return;

        // normalize selected to HH:mm string
        const selectedHHMM = moment(selectedDate).format("HH:mm");

        // If picking end time: must have start and must be after start (same day)
        if (!pickerIsStart) {
            const startStr = weeklyHours[pickerIndex].start;
            if (!startStr) {
                Alert.alert("Select start first", "Please select a start time before selecting an end time.");
                return;
            }

            const startM = timeStringToMomentToday(startStr);
            const endM = moment(selectedDate).hour(moment(selectedDate).hour()).minute(moment(selectedDate).minute()).second(0).millisecond(0);

            // ensure end is strictly after start
            if (!endM.isAfter(startM)) {
                Alert.alert(
                    "Invalid end time",
                    "End time must be later than start time and on the same day. For overnight shifts, enable the next day and set its start time there."
                );
                return;
            }

            // disallow exact midnight as end (00:00) to avoid cross-day confusion
            if (selectedHHMM === "00:00") {
                Alert.alert("Invalid end time", "End time cannot be 12:00 AM (midnight). Use 23:59 for end-of-day.");
                return;
            }

            // save end
            const updated = [...weeklyHours];
            updated[pickerIndex] = { ...updated[pickerIndex], end: selectedHHMM };
            setWeeklyHours(updated);
            return;
        }

        // If picking start time
        if (pickerIsStart) {
            const updated = [...weeklyHours];
            updated[pickerIndex] = { ...updated[pickerIndex], start: selectedHHMM };

            // if existing end exists and is <= new start, clear the end and notify user
            if (updated[pickerIndex].end) {
                const startM = timeStringToMomentToday(selectedHHMM);
                const endM = timeStringToMomentToday(updated[pickerIndex].end);
                if (!endM.isAfter(startM)) {
                    updated[pickerIndex].end = null;
                    Alert.alert(
                        "End time cleared",
                        "Because you changed the start time to after the previous end time, the end time was cleared. Please select an end time again."
                    );
                }
            }

            setWeeklyHours(updated);
            return;
        }
    };

    const toggleDay = (idx) => {
        const copied = [...weeklyHours];
        copied[idx].enabled = !copied[idx].enabled;
        if (!copied[idx].enabled) {
            copied[idx].start = null;
            copied[idx].end = null;
        }
        setWeeklyHours(copied);
    };

    const saveTimings = () => {
        // final sanity: ensure for each enabled day start and end exist and start < end
        for (const d of weeklyHours) {
            if (d.enabled) {
                if (!d.start || !d.end) {
                    Alert.alert("Missing times", `Please set both start and end for ${d.day}`);
                    return;
                }
                const s = timeStringToMomentToday(d.start);
                const e = timeStringToMomentToday(d.end);
                if (!e.isAfter(s)) {
                    Alert.alert("Invalid times", `${d.day}: End time must be after start time.`);
                    return;
                }
            }
        }

        // send to API or state
        // console.log("Final timings:", weeklyHours);
        // Alert.alert("Saved", "Timings saved (check console). Replace with your API call.");

        const payload = {
            merchantTimmings: weeklyHours,
        }
        console.log(payload, data, "VAA");
        setIsLoading(true)
        updateMerchantProfile(data?._id, payload)
            .then(response => {
                setIsLoading(false);
                if (response?.data?.status === 'ok') {
                    let newUser = response?.data?.data;
                    console.log(newUser, "newUsernewUser");

                    AsyncStorage.setItem('user', JSON.stringify(newUser));
                    dispatch(setUserData(newUser));
                    alert('Profile updated successfully');
                } else {
                    alert('Something went wrong!');
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    }

    return (
        <>
            <OverLayLoader isloading={isLoading} />
            <View style={{ flex: 1 }}>
                <Header goBack text={"Update Timmings"} />
                <ScrollView style={{ padding: 16 }}>
                    {weeklyHours.map((it, i) => (
                        <View
                            key={it.day}
                            style={{
                                backgroundColor: "#fff",
                                padding: 14,
                                borderRadius: 12,
                                marginBottom: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.08,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.darkText }}>{it.day}</Text>

                                <TouchableOpacity
                                    onPress={() => toggleDay(i)}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 6,
                                        borderRadius: 20,
                                        backgroundColor: it.enabled ? "#4CAF50" : "#c6c6c6",
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>{it.enabled ? "Enabled" : "Disabled"}</Text>
                                </TouchableOpacity>
                            </View>

                            {it.enabled && (
                                <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between" }}>
                                    <TouchableOpacity
                                        onPress={() => openPicker(i, true)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#333",
                                            borderRadius: 8,
                                            paddingVertical: 12,
                                            width: "45%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{ color: "#000" }}>{it.start ? moment(it.start, "HH:mm").format("hh:mm A") : "Start Time"}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => openPicker(i, false)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#333",
                                            borderRadius: 8,
                                            paddingVertical: 12,
                                            width: "45%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{ color: "#000" }}>{it.end ? moment(it.end, "HH:mm").format("hh:mm A") : "End Time"}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>

                {showPicker && (
                    <DateTimePicker
                        mode="time"
                        value={pickerValue}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        is24Hour={false}
                        onChange={onTimeSelected}
                    />
                )}

                <Button heading={'Save Timings'} onPress={saveTimings} />
                {/* <TouchableOpacity
        onPress={saveTimings}
        style={{
          backgroundColor: colors.darkText,
          padding: 14,
          borderRadius: 8,
          alignSelf: "center",
          marginVertical: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Save Timings</Text>
      </TouchableOpacity> */}
            </View>
        </>
    );
};

export default MerchantTimings;




{/* <Button heading={'Save Timings'} onPress={saveTimings} /> */ }




