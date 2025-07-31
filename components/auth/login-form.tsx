"use client"

import { Input } from "../ui/input";
import Form from 'next/form'
import { Label } from "../ui/label";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { loginAction } from "@/app/actions/loginAction";
import { Alert, AlertDescription } from "../ui/alert";

export function LoginForm() {
	const [state, formAction, isPending] = useActionState(loginAction, {
		success: false,
		message: ''
	})

	return (
		<Form action={formAction} className="space-y-4">
			{state.message && !state.success && (
				<Alert variant="destructive">
					<AlertDescription>{state.message}</AlertDescription>
				</Alert>
			)}
			
			<div className="space-y-2">
				<Label htmlFor="username">Usuário</Label>
				<Input
					id="username"
					name="username"
					type="text"
					placeholder="Digite seu usuário"
					disabled={isPending}
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="password">Senha</Label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Digite sua senha"
					disabled={isPending}
					required
				/>
			</div>
			<Button
				type="submit"
				className="w-full"
				disabled={isPending}
			>
				{isPending ? "Entrando..." : "Entrar"}
			</Button>
		</Form>
	)
}