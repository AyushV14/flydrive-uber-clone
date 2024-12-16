import CustomButton from "@/components/custombtn";
import InputField from "@/components/inputfield";
import OAuth from "@/components/oauth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

const SignIn = () =>{

    const [form , setForm] = useState({
        email:'',
        password:'',
    })
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

     const onSignInPress = useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form.email, form.password])


    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image
                        source={images.signUpCar} className="z-0 w-full h-[250px]"
                    />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                        Welcome👋
                    </Text>
                </View>

                <View className="p-5 ">
                    <InputField 
                        label='Email'
                        placeholder='Enter Your Email'
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value)=> setForm({
                            ...form, 
                            email: value,
                        }
                    )}
                    />
                    <InputField 
                        label='Password'
                        placeholder='Enter Your Password'
                        icon={icons.lock}
                        secureTextEntry={true}
                        value={form.password}
                        onChangeText={(value)=> setForm({
                            ...form, 
                            password: value,
                        }
                    )}
                    />

                    <CustomButton
                        title="Sign In"
                        onPress={onSignInPress}
                        className="mt-6"
                    />

                    {/* o Auth  */}
                    <OAuth/>


                    <Link href='/sign-up' className="text-lg text-center text-general-200 mt-10">
                        <Text>
                            Don't Have an Account?
                        </Text>
                        <Text className="text-primary-500">
                            Log In
                        </Text>
                    </Link>
                </View>

                 {/* Verification Modal  */}
            </View>
        </ScrollView>
    )
}

export default SignIn;