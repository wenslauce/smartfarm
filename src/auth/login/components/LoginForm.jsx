/* eslint-disable react/prop-types */
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom"

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false).optional(),
})

export default function LoginForm({ flip }) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate demo login delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store demo user data
      sessionStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('isDemoUser', 'true')
      sessionStorage.setItem('demoUser', JSON.stringify({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
      }))

      toast({
        title: "Demo login successful",
        description: "Welcome to the demo account!",
      })
      
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: "Demo login failed",
        description: "Unable to access demo account",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Here you would integrate your actual authentication logic
      // For example with NextAuth.js:
      // const result = await signIn('credentials', {
      //   redirect: false,
      //   email: data.email,
      //   password: data.password,
      // })
      
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store auth state (replace with your auth management solution)
      if (data.rememberMe) {
        localStorage.setItem('isAuthenticated', 'true')
      } else {
        sessionStorage.setItem('isAuthenticated', 'true')
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <button 
              onClick={flip}
              className="font-medium text-primary hover:text-primary-dark"
            >
              create a new account
            </button>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleDemoLogin}
                className="w-full"
              >
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Try Demo Account
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}