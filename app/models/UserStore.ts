import { types, flow, Instance } from "mobx-state-tree"

export const UserModel = types.model("User", {
  id: types.identifierNumber,
  name: types.string,
  age: types.number,
  feesPaid: types.number,
  date: types.string,
  location: types.string,
})

export const UserStoreModel = types
  .model("UserStore", {
    users: types.optional(types.array(UserModel), []),
  })
  .actions((self) => {
    const setUsers = (data: any[]) => {
      self.users.replace(data)
    }

    const fetchUsers = flow(function* () {
      try {
        const response = yield fetch("http://localhost:3000/")
        const data = yield response.json()

        const normalized = data
          .filter((item: any) => item.user.age >= 0) // ✅ filter BEFORE mapping
          .map((item: any) => ({
            id: item.id,
            name: `${item.user.name} ${item.user.lastname}`,
            age: item.user.age,
            feesPaid: item.user.fee,
            date: item.date,
            location: item.location,
          }))

        setUsers(normalized)
      } catch (error) {
        console.error("❌ Failed to fetch users:", error)
      }
    })

    return { setUsers, fetchUsers }
  })
  .views((self) => ({
    get totalFeesPaid() {
      return self.users.reduce((sum, user) => sum + user.feesPaid, 0)
    },
  }))

export interface User extends Instance<typeof UserModel> {}
