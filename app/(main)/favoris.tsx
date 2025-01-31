import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import ScrollableLayout from '@/components/layouts/ScrollableLayout'
import HeaderLayout from "@/components/layouts/HeaderLayout";

export default function FavorisScreen() {
  return (
    <>
    <HeaderLayout />
    <ScrollableLayout>
      <SafeAreaView>
        <Text>FavorisScreen</Text>
      </SafeAreaView>
    </ScrollableLayout></>
  )
}