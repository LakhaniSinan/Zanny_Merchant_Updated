import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { width, height } from 'react-native-dimension';
import { colors } from '../../../constants';

const OrdersImages = ({ imageUrl }) => {
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <View style={styles.imgview}>
            <Image
                onLoadEnd={() => setImageLoading(false)}
                source={{ uri: imageUrl }}
                style={styles.img}
                resizeMode="cover"
            />
            {imageLoading && (
                <View
                    style={{
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                    }}>
                    <ActivityIndicator size={'large'} color={colors.pinkColor} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imgview: {
        flexWrap: 'wrap',
        width: '30%',
        marginLeft: '4%',
        marginTop: '4%',
        marginBottom: '4%',
    },
    img: {
        height: height(12),
        width: width(25),
        borderRadius: 10,
    },
});

export default OrdersImages;