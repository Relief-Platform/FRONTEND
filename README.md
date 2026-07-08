# ReliefConnect – Frontend

Vue 3 + Vite + TypeScript + Pinia + Axios + Element Plus

## Khởi động nhanh

```bash
npm install
npm run dev        # http://localhost:5173
```

## Cấu hình môi trường

Tạo file `.env.local` ở root (không commit):
```env
VITE_API_BASE_URL=https://localhost:7000/api
VITE_APP_TITLE=ReliefConnect
```

---

## Cấu trúc thư mục

```
src/
├── config/
│   └── env.ts               # Typed import.meta.env – single source of truth
├── lib/
│   └── api/
│       ├── http.ts           # Axios instance + interceptors + ApiError
│       └── token-storage.ts  # localStorage token wrapper
├── components/
│   ├── ui/                   # BaseButton, BaseInput, BaseCard, BaseSpinner
│   │   └── index.ts          # Barrel export
│   └── layout/
│       └── AppLayout.vue     # Navbar + logout + <RouterView/>
├── composables/
│   ├── index.ts              # Barrel export
│   ├── useApi.ts             # Generic API call wrapper (loading/error)
│   ├── useConfirm.ts         # Confirm dialog
│   ├── useDebouncedRef.ts    # Debounced reactive ref / search
│   ├── useLocalStorage.ts    # Type-safe reactive localStorage
│   └── usePagination.ts      # Pagination state helpers
├── features/
│   ├── auth/
│   │   ├── auth.api.ts       # loginUser, registerUser, loginWithGoogle
│   │   └── auth.types.ts     # LoginPayload, RegisterPayload, AuthUser, AuthResponse
│   └── users/
│       ├── users.api.ts      # CRUD: get, create, update, delete
│       ├── users.types.ts    # User, CreateUserPayload, PaginatedUsers
│       └── UserFormDialog.vue
├── stores/
│   ├── auth.ts               # Pinia: token, user, isLoggedIn, login(), logout()
│   └── users.ts              # Pinia: users list, pagination, fetch, remove
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── UsersView.vue
│   └── NotFoundView.vue
├── router/
│   └── index.ts              # Lazy routes + auth guard (requiresAuth / guestOnly)
├── App.vue
├── main.ts
└── vite-env.d.ts
```

---

## Quy tắc

| Quy tắc | Mô tả |
|---|---|
| **API calls** | Luôn dùng `src/lib/api/http.ts`, KHÔNG dùng `fetch` hay tạo axios mới |
| **Token** | Chỉ dùng `tokenStorage` từ `lib/api/token-storage.ts` |
| **URL backend** | Chỉ sửa `VITE_API_BASE_URL` trong `.env.local` |
| **Env vars** | Luôn import từ `@/config/env.ts`, không đọc `import.meta.env` trực tiếp |
| **Types** | Định nghĩa interface trong `*.types.ts` của feature tương ứng |
| **State** | Dùng Pinia store, không lưu state phức tạp trong component |

---

## Thêm feature mới

1. Tạo folder `src/features/<tên>/`
2. Thêm `<tên>.types.ts` → interface
3. Thêm `<tên>.api.ts` → gọi `http.get/post/put/delete`
4. Thêm Pinia store vào `src/stores/<tên>.ts`
5. Thêm view vào `src/views/<Tên>View.vue`
6. Đăng ký route trong `src/router/index.ts`