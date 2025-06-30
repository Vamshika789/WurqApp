// app/screens/MainScreen.tsx

import React, { useEffect, useState } from "react"
import { View, Text, FlatList, StyleSheet, Dimensions, Platform } from "react-native"
import { Screen } from "../components/Screen"
import { Button } from "../components/Button"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "../navigators/AppNavigator"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Responsive breakpoints
const isTablet = screenWidth >= 768
const isLargeScreen = screenWidth >= 1024
const isSmallScreen = screenWidth < 375

// Define the user type based on your JSON structure
interface ApiUser {
  id: number | string;
  user: {
    name: string;
    lastname: string;
    age: number;
    fee: number;
  };
  date: string;
  location: string;
}

interface User {
  id: number;
  name: string;
  age: number;
  feesPaid: number;
  date: string;
  location: string;
}

export const MainScreen = () => {
  const [users, setUsers] = useState<User[]>([])
  const [totalFees, setTotalFees] = useState<number>(0)
  const [orientation, setOrientation] = useState(screenWidth > screenHeight ? 'landscape' : 'portrait')

  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait')
    })

    return () => subscription?.remove()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/")
        const data: ApiUser[] = await response.json()

        console.log("data", data)

        // Normalize user data from API
        const parsedUsers: User[] = data
          .map((item) => ({
            id: Number(item.id),
            name: `${item.user.name} ${item.user.lastname}`,
            age: item.user.age,
            feesPaid: item.user.fee,
            date: item.date,
            location: item.location,
          }))
          .filter((user) => user.age >= 0)

        setUsers(parsedUsers)

        const total = parsedUsers.reduce((sum, user) => sum + user.feesPaid, 0)
        setTotalFees(total)
      } catch (error) {
        console.error("❌ Failed to fetch users:", error)
      }
    }

    fetchUsers()
  }, [])

  const getCardColor = (age: number) => {
    if (age < 30) return "#ccc"   // gray
    if (age <= 50) return "#f66"  // red
    return "#66f"                 // blue
  }

  // Calculate responsive columns
  const getNumColumns = () => {
    if (isLargeScreen) return 3
    if (isTablet || orientation === 'landscape') return 2
    return 1
  }

  const renderItem = ({ item }: { item: User }) => (
    <View style={[
      styles.card, 
      { backgroundColor: getCardColor(item.age) },
      getNumColumns() > 1 && styles.cardGrid
    ]}>
      <Text style={[styles.name, isSmallScreen && styles.nameSmall]}>{item.name}</Text>
      <Text style={[styles.cardText, isSmallScreen && styles.cardTextSmall]}>
        Age: {item.age}
      </Text>
      <Text style={[styles.cardText, isSmallScreen && styles.cardTextSmall]}>
        Fees Paid: ${item.feesPaid}
      </Text>
      <Text style={[styles.cardText, isSmallScreen && styles.cardTextSmall]}>
        Date: {item.date}
      </Text>
      <Text style={[styles.cardText, isSmallScreen && styles.cardTextSmall]}>
        Location: {item.location}
      </Text>
    </View>
  )

  return (
    <Screen preset="scroll" backgroundColor="#fff">
      <View style={styles.container}>
        <Text style={[
          styles.total,
          isTablet && styles.totalTablet,
          isSmallScreen && styles.totalSmall
        ]}>
          Total Fees Paid: ${totalFees.toLocaleString()}
        </Text>

        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={getNumColumns()}
          key={`${getNumColumns()}-${orientation}`} // Force re-render on column change
          contentContainerStyle={[
            styles.listContainer,
            isTablet && styles.listContainerTablet
          ]}
          columnWrapperStyle={getNumColumns() > 1 ? styles.row : undefined}
          showsVerticalScrollIndicator={false}
        />

        <View style={[
          styles.buttonGroup,
          isTablet && styles.buttonGroupTablet,
          orientation === 'landscape' && isTablet && styles.buttonGroupLandscape
        ]}>
          <Button 
            text="Timer Screen" 
            onPress={() => navigation.navigate("Timer")}
            style={[styles.button, isTablet && styles.buttonTablet]}
          />
          
          <Button 
            text="🧾 Form Screen" 
            onPress={() => navigation.navigate("UserForm")}
            style={[styles.button, isTablet && styles.buttonTablet]}
          />
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isTablet ? 24 : 16,
  },
  total: {
    fontSize: isTablet ? 28 : isSmallScreen ? 18 : 20,
    fontWeight: "bold",
    marginBottom: isTablet ? 24 : 16,
    textAlign: "center",
    color: "#333",
  },
  totalTablet: {
    fontSize: 32,
    marginBottom: 32,
  },
  totalSmall: {
    fontSize: 16,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listContainerTablet: {
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  card: {
    padding: isTablet ? 20 : isSmallScreen ? 12 : 16,
    borderRadius: 12,
    marginBottom: isTablet ? 16 : 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGrid: {
    flex: 1,
    marginHorizontal: 8,
    maxWidth: isLargeScreen ? '30%' : '45%',
  },
  name: {
    fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
    fontWeight: "600",
    marginBottom: 4,
    color: '#fff',
  },
  nameSmall: {
    fontSize: 14,
  },
  cardText: {
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    color: '#fff',
    marginBottom: 2,
  },
  cardTextSmall: {
    fontSize: 11,
  },
  buttonGroup: {
    marginTop: 24,
    gap: isTablet ? 16 : 12,
  },
  buttonGroupTablet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  buttonGroupLandscape: {
    marginTop: 20,
  },
  button: {
    minHeight: isTablet ? 56 : 48,
  },
  buttonTablet: {
    flex: 1,
    marginHorizontal: 8,
    minHeight: 60,
  },
})