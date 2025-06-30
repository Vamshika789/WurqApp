// app/screens/TimerScreen.tsx
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Dimensions, ScrollView, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen } from "../components/Screen"
import { useStores } from "../models/helpers/useStores"
import { User } from "../models/UserStore"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/AppNavigator"
import { Button } from "../components/Button"

export const TimerScreen = observer(() => {
  const { userStore } = useStores()
  const [seconds, setSeconds] = useState(0)
  const [promiseDone, setPromiseDone] = useState(false)
  const [screenData, setScreenData] = useState(Dimensions.get('window'))
  
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  // Dynamic responsive breakpoints
  const isTablet = screenData.width >= 768
  const isLargeScreen = screenData.width >= 1024
  const isSmallScreen = screenData.width < 375

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window)
    })

    return () => subscription?.remove()
  }, [])

  // 🔁 Timer that increases every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // ⏳ Fetch users when the screen mounts
  useEffect(() => {
    userStore.fetchUsers()
  }, [])

  // ⏱ Promise that resolves after 3 seconds
  useEffect(() => {
    const runPromise = () => {
      return new Promise((resolve) => {
        let count = 0
        const interval = setInterval(() => {
          count++
          console.log("Tick", count)
          if (count === 3) {
            clearInterval(interval)
            resolve(true)
          }
        }, 1000)
      })
    }

    runPromise().then(() => {
      setPromiseDone(true)
    })
  }, [])

  // Format time display
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 🧾 Format all users into a text block
  const allUsersText = userStore.users
    .map((u: User) => `${u.name} | Age: ${u.age} | Fees: $${u.feesPaid}`)
    .join("\n")

  // Dynamic styles based on current screen dimensions
  const dynamicStyles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: isTablet ? 24 : 16,
      paddingTop: isTablet ? 20 : 16,
      paddingBottom: 0, // Remove bottom padding to use full height
    },
    timerSection: {
      backgroundColor: '#f8f9fa',
      borderRadius: 16,
      padding: isTablet ? 24 : 16,
      marginBottom: isTablet ? 20 : 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    timer: {
      fontSize: isTablet ? 32 : isSmallScreen ? 20 : 24,
      fontWeight: "bold",
      color: '#2c3e50',
      letterSpacing: 1,
    },
    statusContainer: {
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#fff',
      borderRadius: 20,
      minHeight: 40,
      justifyContent: 'center',
    },
    status: {
      fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
      textAlign: 'center',
      color: '#7f8c8d',
    },
    statusComplete: {
      color: '#27ae60',
      fontWeight: '600',
    },
    usersSection: {
      flex: 1, // Take remaining space
      marginBottom: isTablet ? 20 : 16,
    },
    title: {
      fontSize: isTablet ? 22 : isSmallScreen ? 16 : 18,
      fontWeight: "600",
      marginBottom: isTablet ? 16 : 8,
      color: '#2c3e50',
    },
    usersContainer: {
      flex: 1, // Fill remaining space
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: isTablet ? 16 : 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    usersScrollContent: {
      flexGrow: 1,
      paddingBottom: 10,
    },
    users: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
      lineHeight: isTablet ? 26 : isSmallScreen ? 18 : 22,
      color: '#2c3e50',
    },
    buttonContainer: {
      paddingTop: isTablet ? 16 : 12,
      paddingBottom: isTablet ? 20 : 16,
      paddingHorizontal: isTablet ? 24 : 16,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e9ecef',
    },
    backButton: {
      minHeight: isTablet ? 56 : 48,
      paddingHorizontal: isTablet ? 32 : 24,
      alignSelf: isTablet ? 'center' : 'stretch',
      minWidth: isTablet ? 200 : undefined,
    },
  })

  return (
    <Screen preset="fixed" backgroundColor="#fff">
      <View style={dynamicStyles.mainContainer}>
        {/* Timer Section - Fixed at top */}
        <View style={dynamicStyles.timerSection}>
          <Text style={dynamicStyles.timer}>
            ⏱ {formatTime(seconds)}
          </Text>
          
          <View style={dynamicStyles.statusContainer}>
            <Text style={[
              dynamicStyles.status,
              promiseDone && dynamicStyles.statusComplete
            ]}>
              {promiseDone ? "Promise finished after 3 seconds" : "⏳ Waiting for promise..."}
            </Text>
          </View>
        </View>

        {/* Users Section - Scrollable middle */}
        <View style={dynamicStyles.usersSection}>
          <Text style={dynamicStyles.title}>
            All Users:
          </Text>
          
          <ScrollView 
            style={dynamicStyles.usersContainer}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={dynamicStyles.usersScrollContent}
          >
            <Text style={dynamicStyles.users}>
              {userStore.users.length > 0 ? allUsersText : "No users found."}
            </Text>
          </ScrollView>
        </View>

        {/* Fixed Button at Bottom */}
        <View style={dynamicStyles.buttonContainer}>
          <Button
            text="← Go Back"
            preset="default"
            onPress={() => navigation.goBack()}
            style={dynamicStyles.backButton}
          />
        </View>
      </View>
    </Screen>
  )
})