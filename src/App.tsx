import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Landing } from '@/pages/Landing'
import { Auth } from '@/pages/Auth'
import { PasswordReset } from '@/pages/PasswordReset'
import { VerifyEmail } from '@/pages/VerifyEmail'
import { Profile } from '@/pages/Profile'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Dashboard } from '@/pages/Dashboard'
import { SellerDashboard } from '@/pages/SellerDashboard'
import { Listings } from '@/pages/Listings'
import { ListingDetail } from '@/pages/ListingDetail'
import { CreateListing } from '@/pages/CreateListing'
import { Checkout } from '@/pages/Checkout'
import { Orders } from '@/pages/Orders'
import { Messaging } from '@/pages/Messaging'
import { Reviews } from '@/pages/Reviews'
import { Admin } from '@/pages/Admin'
import { Settings } from '@/pages/Settings'
import { Help } from '@/pages/Help'
import { About } from '@/pages/About'
import { Privacy } from '@/pages/Privacy'
import { Terms } from '@/pages/Terms'
import { NotFound } from '@/pages/NotFound'
import { Error } from '@/pages/Error'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="seller" element={<SellerDashboard />} />
          </Route>
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/create" element={<CreateListing />} />
          <Route path="/listings/:id/edit" element={<CreateListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
