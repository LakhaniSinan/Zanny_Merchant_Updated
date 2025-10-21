import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Linking } from 'react-native';
import { width } from 'react-native-dimension';
import { colors } from '../../constants';
import Header from '../../components/header';

const Documentation = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          height: 60,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: width(3),
          backgroundColor:colors.black
        }}
       >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              color: colors.white,
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            {"Compliance for cooking on Zanny's Food"}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ marginHorizontal: width(4), marginBottom: width(4), marginTop: width(2) }}>
          {/* <Text
            style={{
              textAlign: 'center',
              color: colors.yellow,
              fontSize: 14,
              fontWeight: '600',
              alignItems: 'center',
            }}>
            
          </Text> */}
        </View>
        <View style={{ marginHorizontal: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: 'black',
              fontSize: 14,
              fontWeight: '600',
            }}>
            If you want to sell homemade food and drink on ZANNYS FOOD, it's
            your responsibility to ensure that you comply with all local
            regulations. Customers may ask you for proof of registration.
          </Text>
        </View>
        <View style={{ marginHorizontal: width(4), marginTop: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: colors.yellow,
              fontSize: 14,
              fontWeight: '600',
            }}>
            UNITED KINGDOM
          </Text>
        </View>
        <View style={{ marginHorizontal: width(4), marginTop: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: colors.black,
              fontSize: 14,
              fontWeight: '600',
            }}>
            1. Register with your local council for{' '}
            <Text
              style={{ color: colors.yellow }}
              onPress={() =>
                Linking.openURL('https://www.gov.uk/food-business-registration')
              }>
              free here!
            </Text>
            (10 mins)
          </Text>
          <Text style={{ color: colors.black }}>
            It can take up to 28 days to receive final confirmation of your
            registration but you are generally allowed to trade once you have
            confirmation of your application
          </Text>
          <Text style={{ color: colors.black, marginTop: width(2) }}>
            You don't need to register if you are selling homegrown fruit/ veg
            or raw produce like eggs or honey.
          </Text>
        </View>
        <View style={{ marginHorizontal: width(4), marginTop: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: colors.black,
              fontSize: 14,
              fontWeight: '600',
            }}>
            2. Decide how you want to trade (up to 30 mins)
          </Text>
          <Text style={{ color: colors.black, textAlign: 'justify' }}>
            As an INDIVIDUAL
          </Text>
          <Text style={{ color: colors.black, textAlign: 'justify' }}>
            You’re allowed to generate up to £1,000 of income without needing to
            declare it to HMRC -
            <Text
              style={{ color: colors.yellow }}
              onPress={() =>
                Linking.openURL('https://www.gov.uk/set-up-sole-trader')
              }>
              explained here
            </Text>
          </Text>
          <Text
            style={{
              color: colors.black,
              textAlign: 'justify',
              marginTop: width(2),
            }}>
            As a BUSINESS
          </Text>
          <Text style={{ color: colors.black, textAlign: 'justify' }}>
            As a sole trader - If you anticipate you will generate more than
            £1,000 of income from selling food/crafts from home you need to
            <Text
              style={{ color: colors.yellow }}
              onPress={() =>
                Linking.openURL(
                  'https://www.gov.uk/log-in-file-self-assessment-tax-return/register-if-youre-self-employed',
                )
              }>
              Inform HMRC.{' '}
            </Text>
            This is to alert them that you will pay tax through Self-Assessment.
            You need to
            <Text
              style={{ color: colors.yellow }}
              onPress={() =>
                Linking.openURL('https://www.gov.uk/set-up-sole-trader')
              }>
              register as a sole trader,
            </Text>
            even if you are part-time or have another job. You can do this at
            any time.
          </Text>
          <Text
            style={{
              color: colors.black,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            As a Limited Company -
            <Text
              style={{ color: colors.yellow }}
              onPress={() =>
                Linking.openURL('https://www.gov.uk/limited-company-formation')
              }>
              Click here
            </Text>
            if you would like to register a Limited company
          </Text>
        </View>

        <View style={{ marginHorizontal: width(4), marginTop: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: colors.black,
              fontSize: 14,
              fontWeight: '600',
            }}>
            3. IF you want to register as a business, check out government
            guidance for starting a business at home
            <Text
              style={{ color: colors.yellow }}
              onPress={() =>
                Linking.openURL('https://www.gov.uk/run-business-from-home')
              }>
              here
            </Text>
            (30 mins){' '}
          </Text>
          <Text
            style={{
              color: colors.black,
              textAlign: 'justify',
              marginTop: width(2),
            }}>
            You may need permission to run a business from home either from a
            landlord if you are renting or from your mortgage company if you are
            a homeowner
          </Text>
          <Text
            style={{
              color: colors.black,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            You do not need public liability insurance to sell products online.
            However, it is easy to get and can give some makers peace of mind.
          </Text>
          <Text
            style={{
              color: colors.black,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            If you employ anyone, there is a legal requirement to have employers
            liability insurance
          </Text>
        </View>

        <View style={{ marginHorizontal: width(4), marginTop: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: colors.black,
              fontSize: 14,
              fontWeight: '600',
            }}>
            4. Whether selling as an INDIVIDUAL or as a BUSINESS, it is wise to
            get up to speed on food hygiene and allergens (30mins - 1hr)
          </Text>
          <Text
            onPress={() =>
              Linking.openURL(
                'https://www.food.gov.uk/business-guidance/food-hygiene-for-your-business',
              )
            }
            style={{
              color: colors.yellow,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            Click here for food hygiene information
          </Text>
          <Text
            onPress={() =>
              Linking.openURL(
                'https://secure.helpscout.net/members/authorize?jump=http%3A%2F%2Fhelp.olioex.com%2Fauthorize%3FsiteId%3D5ac26746042863794fbed1bf',
              )
            }
            style={{
              color: colors.yellow,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            Click here for our guide to allergens
          </Text>
          <Text
            onPress={() =>
              Linking.openURL('https://allergytraining.food.gov.uk/')
            }
            style={{
              color: colors.yellow,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            Click here for an optional training course on allergens
          </Text>
        </View>

        <View style={{ marginHorizontal: width(4), marginTop: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: colors.black,
              fontSize: 14,
              fontWeight: '600',
            }}>
            5. Both INDIVIDUAL and BUSINESS sellers should complete a HACCP (1-2
            hours)
          </Text>
          <Text
            style={{
              color: colors.black,
              textAlign: 'justify',
              marginTop: width(2),
            }}>
            Anyone who is food registered must have a HACCP in place. A HACCP is
            a type of risk assessment where you identify hazards and steps that
            can minimise them. Download links below:
          </Text>
          <Text
            onPress={() =>
              Linking.openURL(
                'https://s3.amazonaws.com/helpscout.net/docs/assets/5ac26746042863794fbed1be/attachments/5f73568952faff00174f4448/HACCP-basic-template.docx',
              )
            }
            style={{
              color: colors.yellow,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            HACCP basic template
          </Text>
          <Text
            onPress={() =>
              Linking.openURL(
                'https://www.food.gov.uk/business-guidance/hazard-analysis-and-critical-control-point-haccp',
              )
            }
            style={{
              color: colors.yellow,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            HACCP advanced template
          </Text>
          <Text
            style={{
              color: colors.black,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            You may find this
            <Text
              onPress={() =>
                Linking.openURL(
                  'https://www.food.gov.uk/business-guidance/safer-food-better-business-for-caterers',
                )
              }
              style={{
                color: colors.yellow,
              }}>
              Safer food, better business
            </Text>
            for caterers pack useful to understand and address food safety and
            hygiene risks
          </Text>
        </View>

        <View style={{ marginHorizontal: width(4), marginTop: width(4) }}>
          <Text
            style={{
              textAlign: 'justify',
              color: colors.black,
              fontSize: 14,
              fontWeight: '600',
            }}>
            6. Prepare for an online self-assessment of your kitchen and/or a
            visit from a food safety officer (30 mins)
          </Text>
          <Text
            style={{
              color: colors.black,
              textAlign: 'justify',
              marginTop: width(2),
            }}>
            Once you’ve ReadyForPickup your food registration, your Local Authority
            will likely offer an online self-assessment if you’re selling
            low-risk items or selling in small quantities
          </Text>
          <Text
            style={{
              color: colors.black,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            If you’re selling large quantities and/or higher risk items, your
            local authority may get in touch to arrange a kitchen visit from a
            food safety officer
          </Text>
          <Text
            style={{
              color: colors.black,
              marginTop: width(2),
              textAlign: 'justify',
            }}>
            You may receive a food hygiene rating after completing this step
          </Text>
          <Text
            style={{
              color: colors.yellow,
              marginTop: width(2),
              textAlign: 'right',
              fontWeight: '600',
              marginBottom: width(5)
            }}>
            You are all set!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Documentation;
