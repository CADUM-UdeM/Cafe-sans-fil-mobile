import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '@/constants/Colors'
import TYPOGRAPHY from '@/constants/Typography'
import { CupSoda, LucideIcon } from 'lucide-react-native'

export default function CategoryCard({ name, icon }: { name: string, icon: LucideIcon }) {
  return (
    <TouchableOpacity activeOpacity={.7} style={{gap: 12, alignItems: 'center', justifyContent: "center", flexWrap:"wrap"}}>
        <View style={{backgroundColor: COLORS.lightGray, paddingVertical: 20, paddingHorizontal: 24, borderRadius: 100}}>
            {React.createElement(icon, {color: "black"})}
        </View>
        <Text style={[TYPOGRAPHY.body.large.semiBold, {textAlign: "center", color: COLORS.subtuleDark}]}>
          {name.length > 8 && name.split(' ').length > 1 ? name.slice(0, 8) + "\n" + name.slice(8) : name}
        </Text>
    </TouchableOpacity>

  )
}