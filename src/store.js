import { create } from "zustand";
import { persist } from "zustand/middleware"

export const useLocalStore = create(
    persist((set, get) => ({
        access_token: null,
        setAccessToken: (value) => set({ access_token: value }),

        local_lead_task: [],
        setLocalLeadTask: (value) => set({local_lead_task: [...get().local_lead_task, value]})

    }), {
        name: 'local-storage',
    })
)

export const useAppStore = create((set, get) => ({

    page: 1,
    setPage: (value) => set({ page: value }),

    leads: [],
    setLeads: (value) => set({ leads: value }),

    open_lead: [],
    setOpenLead: (id) => set({ open_lead: get().open_lead.indexOf(id) !== -1 ? [...get().open_lead.slice(0, get().open_lead.indexOf(id)), ...get().open_lead.slice(indexOf(id) + 1)] : [...get().open_lead, id] }),

    refresh_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJjOGRkNmFjMTI2ZDUyMzI3ODVhZWEwN2Y3MDM1NTY5ZGRiNjE5NTE1NTA0ZTZjN2JiNmU3NjIzOThiZDRlZTE1NmFlZGY5NDJiZTlhZjBhIn0.eyJhdWQiOiIzNDc3ZTdkMC0xMTllLTQwOWItOGIxZi02YjAyODE5OTllMjgiLCJqdGkiOiIyYzhkZDZhYzEyNmQ1MjMyNzg1YWVhMDdmNzAzNTU2OWRkYjYxOTUxNTUwNGU2YzdiYjZlNzYyMzk4YmQ0ZWUxNTZhZWRmOTQyYmU5YWYwYSIsImlhdCI6MTcyNTgzNDA3NSwibmJmIjoxNzI1ODM0MDc1LCJleHAiOjE3MjY0NDQ4MDAsInN1YiI6IjExNDkxOTg2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTM5NTg2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiODA3Mjk4MGMtMDM0Zi00MTFmLTllOTAtYjQxYmM0NjhlMjkzIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.qSwIM3X-3UgAl9Qk-0PsOGxzIukoeFUDpddoj4dZ1ZneNX2PfW_S-YxHIlWWjz49_1EyfnUKhtYOb8L86V7mYJqYNIETpsXIyBYTImgRdyjtO4hqnZMz3NBszRqkptSyB31sbXJONL4AQV_6rVQJQjy7m2E5mkh5dsO1W-wGtt036Z5i9zJxsn5MFaD-Q1b49l_DmezrrGVEb6Ju3Uil4zVC1mGPdC70eU0Zi0SVv_h7LAyKWJyobsDQscHZYIi_lhh-1RtlB15UtcoeCdcHGHxJIpJs6CXz0enjYz1GchwmT17kC3Z5hIaMh7PU0X_dsjq6iluixqRDHzl_kuO9UA",
    client_id: "3477e7d0-119e-409b-8b1f-6b0281999e28",
    client_secret: "WDnn7xFjPbWWQWxb5SJpXNVv8FoiGQnmEXqOKzlmAg7JJZpJOHHQWwZwl9JXqUZQ",
}))
