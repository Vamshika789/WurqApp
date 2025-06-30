import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text, Screen } from "@/components"
import { isRTL } from "@/i18n"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { $styles, type ThemedStyle } from "@/theme"
import { useHeader } from "../utils/useHeader"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/utils/useAppTheme"

const welcomeLogo = require("../../assets/images/logo.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(_props) {
  const { themed, theme } = useAppTheme()
  const { navigation } = _props
  const {
    authenticationStore: { logout },
  } = useStores()

  useHeader(
    {
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )

  const handleStart = () => {
    navigation.navigate("Timer")
  }

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($topContainer)}>
        <Image style={themed($welcomeLogo)} source={welcomeLogo} resizeMode="contain" />
        <Text text="Welcome to WurqApp!" preset="heading" style={themed($welcomeHeading)} />
        <Text
          text="Track users, monitor fees, and manage everything with ease."
          preset="subheading"
        />
      </View>

      <View style={themed([$bottomContainer, $bottomContainerInsets])}>
        <Text text="Tap below to begin" size="md" />
        <Button text="Get Started" preset="reversed" onPress={handleStart} />
      </View>
    </Screen>
  )
})

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "60%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "40%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 90,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
