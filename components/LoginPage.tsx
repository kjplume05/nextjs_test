import { signIn } from "@/auth"
 
export default function LoginPage() {
  return (
    <>
        <form action={async () => {
            "use server"
            await signIn("github")
        }}>
            <button type="submit" >Signin with GitHub</button>
        </form>

        <form
            action={async (formData) => {
                "use server"
                try {
                    await signIn("credentials", formData)
                } catch (error) {
                    throw error
                }
                
            }}
        >
        <label>
            Email
            <input name="email" type="email" />
        </label>
        <label>
            Password
            <input name="password" type="password" />
        </label>
        <button>Sign In</button>
        </form>
    </>
    
  )
} 