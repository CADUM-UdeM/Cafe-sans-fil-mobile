import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import ScrollableLayout from '@/components/layouts/ScrollableLayout'

export default function ParametreScreen() {
  return (
    <ScrollableLayout>
      <SafeAreaView>
        <Text>Mon compte</Text>
        <Text>Mes commandes</Text>
        <Text>Mes préférences</Text>
        <Text>Paramètres Application</Text>
        <Text>À propos</Text>
      </SafeAreaView>
    </ScrollableLayout>
  )
}