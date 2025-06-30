import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import * as Screens from "@/screens"
import Config from "../config"
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { ComponentProps } from "react"
import { TimerScreen } from "../screens/TimerScreen"

import { useStores } from "../models"
import UserFormScreen from "../screens/UserFormScreen"
// ----------------------
// 👇 Route list
// ----------------------
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  Timer: undefined
  AddUser: undefined
  UserForm: undefined

}

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

const Stack = createNativeStackNavigator<AppStackParamList>()

// ----------------------
// 👇 AppStack Component
// ----------------------
const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated, authToken },
  } = useStores()

  const {
    theme: { colors },
  } = useAppTheme()

  console.log("🧪 Authenticated:", isAuthenticated)
  console.log("🧪 Auth Token:", authToken)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: { backgroundColor: colors.background },
      }}
      initialRouteName={isAuthenticated ? "Welcome" : "Login"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={Screens.MainScreen} />
          <Stack.Screen name="Timer" component={TimerScreen} />
       
          <Stack.Screen name="Demo" component={DemoNavigator} />
          <Stack.Screen name="UserForm" component={UserFormScreen} />


         


        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  )
})

// ----------------------
// 👇 Navigation Container
// ----------------------
export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <Screens.ErrorBoundary catchErrors={Config.catchErrors}>
          <AppStack />
        </Screens.ErrorBoundary>
      </NavigationContainer>
    </ThemeProvider>
  )
})
