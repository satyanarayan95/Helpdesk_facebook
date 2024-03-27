import * as React from "react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDispatch } from "react-redux";
import { loginUser } from "@/features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email({
        message: "Enter a valid email",
    }),
    password: z.string().min(4, { message: "Password should be atleast 4 characters." }),
    remember_me: z.boolean()
})


export function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            remember_me: false
        },
    })

    const onSubmit = (formData) => {
        try {
            formSchema.parse(formData);
            dispatch(loginUser(formData));
            navigate('/dashboard');
        } catch (error) {
            toast.error("Error occured while logging in", {duration: 2000});
        }
    };

    return (
        <div className="w-full h-full bg-blue-500 flex justify-center items-center">
            <Card className="w-[350px]">
                <CardHeader className="text-center">
                    <CardTitle>Login to your account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
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
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="remember_me"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox {...field} />
                                            </FormControl>
                                            <FormLabel>Remember me</FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit">Login</Button>
                        </form>
                    </Form>
                    <p className="text-center">
                        create an account? <a href="/auth/signup" className="text-blue-500">Signup</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}



