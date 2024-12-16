import CustomButton from "@/components/custombtn";
import InputField from "@/components/inputfield";
import OAuth from "@/components/oauth";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from 'react-native-modal';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccess, setshowSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  });

  // Handle sign-up submission
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setVerification({
        ...verification,
        state: 'pending',
      });
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.errors[0]?.longMessage || 'An unexpected error occurred');
    }
  };

  // Handle verification submission
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: 'success' });
      } else {
        console.error(signUpAttempt);
        setVerification({
          ...verification,
          error: 'Verification failed',
          state: 'failed',
        });
      }
    } catch (err: any) {
      console.error(err);
      setVerification({
        ...verification,
        error: err.errors[0]?.longMessage || 'An unexpected error occurred',
        state: 'failed',
      });
    }
  };

  useEffect(() => {
    if (verification.state === 'success') {
      // Redirect after successful verification
      router.push('/(root)/(tabs)/home');
    }
  }, [verification.state]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image
            source={images.signUpCar} 
            className="z-0 w-full h-[250px]"
          />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <InputField 
            label="Name"
            placeholder="Enter Your Name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField 
            label="Email"
            placeholder="Enter Your Email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField 
            label="Password"
            placeholder="Enter Your Password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          {/* OAuth Component */}
          <OAuth />

          <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
            <Text>Already Have an Account?</Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal 
          isVisible={verification.state === 'pending'}
          onModalHide={() => {if(verification.state==='success') setshowSuccess(true)}}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">Verification</Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification to {form.email}
            </Text>
            <InputField 
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) => setVerification({ ...verification, code })}
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
            )}

            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        {/* Success Modal */}
        <ReactNativeModal isVisible={showSuccess}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image 
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified!
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You've successfully verified your Account
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.replace('/(root)/(tabs)/home')}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
