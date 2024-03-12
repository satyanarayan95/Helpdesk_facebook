import * as React from "react"
import axios from 'axios';

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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().trim(4, { message: "Enter a valid name" }),
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(4, { message: "Password should be atleast 4 characters." }),
    remember_me: z.boolean()
})


export function SignUp() {
    const baseURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            remember_me: false
        },
    })

    const onSubmit = async (formData) => {
        try {
            formSchema.parse(formData);
            const response = await axios.post(`${baseURL}/auth/signup`, formData);
            toast.success('Signup Success', {duration: 2000});
            navigate('/auth/login')
        } catch (error) {
            toast.error('Error while signup', {duration: 2000});
        }
    };

    return (
        <div className="w-full h-full bg-blue-500 flex justify-center items-center">
            <Card className="w-[350px]">
                <CardHeader className="text-center">
                    <CardTitle>Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <Button type="submit">Login</Button>
                        </form>
                        <p className="text-center">
                            Have an account? <a href="/auth/login" className="text-blue-500">Login</a>
                        </p>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
