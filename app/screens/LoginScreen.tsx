import { observer } from "mobx-react-lite"
import { FC, useRef, useState } from "react"
import { TextInput, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const passwordInputRef = useRef<TextInput>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const {
    authenticationStore: { setAuthToken },
  } = useStores()

  const {
    themed,
  } = useAppTheme()

  function login() {
    if (!email.trim() || !password.trim()) {
      setError("Both fields are required.")
      return
    }

    // Set fake auth token and navigate
    setAuthToken("demo-token")
    _props.navigation.navigate("Welcome")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($container)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text preset="heading" text="Login" style={themed($heading)} />
      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
        containerStyle={themed($field)}
      />
      <TextField
        ref={passwordInputRef}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={login}
        containerStyle={themed($field)}
      />

      {error !== "" && <Text text={error} size="sm" style={{ color: "red" }} />}

      <Button
        text="Login"
        onPress={login}
        preset="reversed"
        style={themed($button)}
      />
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xxl,
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $field: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
})
