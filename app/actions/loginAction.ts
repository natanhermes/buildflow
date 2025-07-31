'use server'
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: unknown, formData: FormData) {
	try {
		const username = formData.get("username") as string
		const password = formData.get("password") as string

		await signIn("credentials", {
			username,
			password,
			redirectTo: '/dashboard',
		})

		return {
			success: true,
			message: 'Login realizado com sucesso.',
		}

	} catch (error) {
		if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
			throw error
		}

		if (error instanceof AuthError && error.type === 'CredentialsSignin') {
			return {
				success: false,
				message: 'Dados de acesso incorretos.',
			}
		}

		console.log(error)

		return {
			success: false,
			message: 'Ops! Ocorreu um erro ao realizar o acesso.',
		}
	}
}