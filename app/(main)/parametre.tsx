import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import React, { useState } from 'react'
import ScrollableLayout from "@/components/layouts/ScrollableLayout";
import {
  ChevronRight,
  Package,
  Bell,
  Settings2,
  HelpCircle,
  Info,
} from "lucide-react-native";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TYPOGRAPHY from "@/constants/Typography";
import Divider from "@/components/common/Divider";
import AntDesign from '@expo/vector-icons/AntDesign';  // icone de Instagram
import FontAwesome from '@expo/vector-icons/FontAwesome'; // icone de user-secret 
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// Menu item interface for type safety
interface MenuItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function ParametreScreen() {
  const { user } = useUser();
  const navigation = useRouter();
  const [notifModal,setNotifModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  

  const orders = [
    {
      id: 1,
      image: 'https://placehold.jp/150x150.png',
      title: 'Commande #XXX',
      content: 'Trucs que t\'as acheté',
      restaurant: 'Jean Brilliant',
      price: '$20.00',
    },
    {
      id: 2,
      image: 'https://placehold.jp/150x150.png',
      title: 'Commande #XXX',
      content: 'Trucs que t\'as acheté',
      restaurant: 'André Aisenstadt',
      price: '$15.00',
    },
    // Add more orders as needed
  ];
  

  const [profilePicture, setProfilePicture] = useState('https://placehold.jp/150x150.png');
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setProfilePicture(result.assets[0].uri);
      }
    }
  };
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Menu items data with their respective icons and actions
  const menuItems: MenuItem[] = [
    {
      icon: <Package size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Mes commandes",
      subtitle: "Consultez vos commandes et transactions passées.",
      onPress:() => setOrdersModalVisible(true),
    },
    {
      icon: <Bell size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Mes notifications",
      subtitle: "Configurez vos préférences de notification.",
      onPress: () => console.log("Notifications pressed"),
    },
    {
      icon: <Settings2 size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Mes préférences",
      subtitle: "Gérez et personnalisez vos préférences.",
      onPress: () => console.log("Preferences pressed"),
    },
    {
      icon: <HelpCircle size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "Aide et support",
      subtitle: "Obtenez de l'aide et contactez le support.",
      onPress: () => setHelpModalVisible(true),
    },
    {
      icon: <Info size={26} strokeWidth={2.5} color={COLORS.black} />,
      title: "À propos",
      subtitle: "En savoir plus sur nous et notre mission.",
      onPress: () => setModalVisible(true),
    },
  ];

  // Render a single menu item
  const renderMenuItem = ({ icon, title, subtitle, onPress }: MenuItem) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} key={title}>
      <View style={styles.menuItemLeft}>
        {icon}
        <View style={styles.menuItemText}>
          <Text style={[TYPOGRAPHY.body.large.semiBold, styles.menuItemTitle, { fontSize: 15 }]}>
            {title}
          </Text>
          <Text style={[TYPOGRAPHY.body.small.base, styles.menuItemSubtitle,  { fontSize: 10.6 }]}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
    {/* User Profile Section */}
    <TouchableOpacity style={styles.profileSection} onPress={() => setAccountModalVisible(true)}>
    <View style={styles.profileLeft}>
      <Image
        source={{ uri: "https://i.pravatar.cc/900" }}
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text
          style={[TYPOGRAPHY.heading.small.bold, styles.profileName]}
        >
          {user?.fullName}
        </Text>
        <Text
          style={[TYPOGRAPHY.body.small.base, styles.profileSubtitle,  { fontSize: 11 }]}
        >
          Gérez les informations de votre compte.
        </Text>
      </View>
    </View>
    <ChevronRight size={24} color={COLORS.black} strokeWidth={2.5} />
  </TouchableOpacity>
    <ScrollableLayout>
      <SafeAreaView style={styles.container}>

        

        {/* Menu Items */}
        <View style={styles.menuSection}>{menuItems.map(renderMenuItem)}</View>

        <Divider marginTop={16} marginBottom={4}></Divider>

        {/* System Status */}
        <View style={styles.systemStatus}>
          <Text style={[TYPOGRAPHY.body.normal.semiBold, styles.systemStatusTitle]}>
            État du système
          </Text>
          <View style={styles.systemStatusIndicator}>
            <View style={{ position: 'relative' }}>
              <Animated.View
                style={[
                  styles.pulsingDot,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <View style={styles.statusDot} />
            </View>
            <Text style={[TYPOGRAPHY.body.small.bold, styles.systemStatusText]}>
              Opérationnel
            </Text>
          </View>
          <Text style={[TYPOGRAPHY.body.small.base, styles.systemStatusSubtext]}>
            Le système fonctionne correctement.
          </Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={accountModalVisible}
          onRequestClose={() => setAccountModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mon compte</Text>
                <TouchableOpacity onPress={() => setAccountModalVisible(false)}>
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={pickImage}>
                  <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                </TouchableOpacity>
                <Text style={[{alignSelf:'center',padding:20, fontWeight:500}]}>Modifier votre photo de profil</Text>
                <TextInput style={styles.input } placeholder="Modifier votre Nom" placeholderTextColor="grey" />
                <TextInput style={styles.input} placeholder="Modifier votre Email" placeholderTextColor="grey" />
                <TextInput style={styles.input} placeholder="Modifier votre Mot de passe" secureTextEntry placeholderTextColor="grey"/>
                <TouchableOpacity style={[styles.btn, { backgroundColor: 'red' }]} onPress={() => { /* Add delete account logic here */ }}>
                  <Text style={{ color: 'white', textAlign: 'center', padding: 10, fontSize:20, fontWeight:500 }}>Supprimer votre compte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { backgroundColor: 'White', borderWidth: 1, }]} onPress={() => { setAccountModalVisible(false); navigation.push('../(onboarding)/first-onboarding') }}>
                <Text style={{ color: 'black', textAlign: 'center', padding: 10, fontSize:20, fontWeight:500 }}>Se Déconnecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modernModalTitle}>À propos</Text>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <AntDesign name="close" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.modernModalContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.aboutSection}>
          <View style={styles.sectionIcon}>
            <Info size={24} color={COLORS.black} />
          </View>
          <Text style={styles.sectionTitle}>Bienvenue!</Text>
          <Text style={styles.sectionContent}>
            Avez-vous déjà rêvé d'utiliser une application mobile pour pouvoir commander un bon repas? 
            C'est exactement ce qui a poussé notre équipe à créer une application de ce type. 
            Notre club, du nom de CADUM, est justement à la charge de cela. Ce club vise à développer des applications mobiles pour améliorer la vie des étudiants des différentes universités. 
            Si vous avez tendance à avoir le manque d'énergie de tout le temps commander de la nourriture, nous sommes justement là pour vous. Soyez la bienvenue!
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.aboutSection}>
          <View style={styles.sectionIcon}>
            <FontAwesome name="users" size={22} color={COLORS.black} />
          </View>
          <Text style={styles.sectionTitle}>Club</Text>
          <Text style={styles.sectionContent}>
            L'idée de ce club est venue en hiver 2024. Les étudiants de l'Université de Montréal dans le programme d'informatique voulaient appliquer leurs connaissances acquises dans les cours d'informatique dans la vie réelle.
            Pour cela, ils ont voulu créer un club sur le développement d'applications mobiles pour s'ouvrir à des technologies de pointe.
            Grâce à cela, l'idée a été mise au point en automne 2024. À l'automne 2024, les étudiants ont décidé de développer une application mobile sur la commande de repas à partir des cafétérias de votre université.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.aboutSection}>
          <View style={styles.sectionIcon}>
            <FontAwesome6 name="discord" size={22} color={COLORS.black} />
          </View>
          <Text style={styles.sectionTitle}>Réseaux sociaux</Text>
          <Text style={styles.sectionContent}>
            Comme toute autre compagnie, nous sommes aussi présents sur les réseaux sociaux. Là-bas, vous pouvez suivre toutes les nouvelles dont des activités et même des nouveautés sur l'application mobile en soi.
            Les réseaux sociaux que nous sommes présents sont Instagram et Discord. Cependant, si vous voulez voir les nouveautés qui viennent de sortir, allez sur Discord. N'oubliez pas d'activer les notifications pour d'autres types de nouveautés.
          </Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome6 name="discord" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="instagram" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.aboutSection}>
          <View style={styles.sectionIcon}>
            <FontAwesome name="user-secret" size={22} color={COLORS.black} />
          </View>
          <Text style={styles.sectionTitle}>Politiques et confidentalité</Text>
          <Text style={styles.sectionContent}>
            En termes de politique et de confidentalité, nous respectons la vie privée de chaque individu. Donc, les informations personnelles comme les mots de passe sont confidentielles. 
            Aucun utilisateur peut avoir accès aux informations personnelles de d'autres utilisateurs et même chose avec les développeurs de l'application mobile. 
            En cas de fuites de données ou de piratage de votre compte, veuillez nous contacter immédiatement.
          </Text>
        </View>
        
        <View style={styles.footerSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 CADUM. Tous droits réservés.</Text>
        </View>
      </ScrollView>
    </View>
  </View>
</Modal>
        
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={ordersModalVisible}
          onRequestClose={() => setOrdersModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mes Commandes</Text>
                <TouchableOpacity onPress={() => setOrdersModalVisible(false)}>
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
              {orders.map((order) => (
                <TouchableOpacity key={order.id} style={styles.orderBox} onPress={() => {}}>
                  <Image source={{ uri: order.image }} style={styles.orderImage} />
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderTitle}>{order.title}</Text>
                    <Text style={styles.orderContent}>{order.content}</Text>
                    <Text style={styles.orderRestaurant}>{order.restaurant}</Text>
                  </View>
                  <Text style={styles.orderPrice}>{order.price}</Text>
                </TouchableOpacity>
              ))}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType ="slide"
          transparent={true}
          visible={helpModalVisible}
          onRequestClose={() => setHelpModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modernModalTitle}>Aide et Support</Text>
                <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                  <AntDesign name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>

              <ScrollView 
              style={styles.modernModalContent}
              showsVerticalScrollIndicator={false}
              >
                <View style={styles.helpSection}>
                  <Text style={styles.sectionTitle}>Contactez-nous</Text>
                  <Text style={styles.sectionContent}>
                    Vous avez des questions ou besoin d'aide? {"\n"}
                    Ecrivez-nous sur notre adresse e-mail : blablabla@gmail.com {"\n"}
                    Ou contactez-nous sur Discord
                  </Text>
                  <View style={styles.socialIcons}>
                    <TouchableOpacity style={styles.socialButton}>
                      <FontAwesome6 name="discord" size={24} color="white" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />
                  
                  <Text style={styles.sectionTitle}>FAQ</Text>
                  <Text style={styles.sectionSubtitle}>Vous ne recevez pas vos notifications?</Text>
                  <Text style={styles.sectionContent}>
                    Assurez-vous que les autorisations de notification sont activées dans les paramètres de votre téléphone. {"\n"}
                  </Text>
                  <Text style={styles.sectionSubtitle}>Vous ne pouvez pas vous connecter?</Text>
                  <Text style={styles.sectionContent}>
                    Essayez de réinitialiser votre mot de passe via l'écran de connexion.
                  </Text>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.sectionTitle}>Conseils d'utilisation</Text>
                  <Text style={styles.sectionContent}>
                    - Gardez vos notifications activées pour ne jamais rater une mise à jour.{"\n"}{"\n"}
                    - Vérifiez régulièrement l'onglet commandes pour vos suivis.
                  </Text>
                  
                </View>
                <View style={styles.footerSection}>
                  <Text style={styles.versionText}>Version 1.0.0</Text>
                  <Text style={styles.copyrightText}>© 2025 CADUM. Tous droits réservés.</Text>
                </View>
              </ScrollView>
                
            </View>
          </View>
        </Modal>
        

        
      </SafeAreaView>
    </ScrollableLayout></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: COLORS.lightGray,
    borderTopColor: COLORS.white,
    backgroundColor: COLORS.white,
    paddingTop: SPACING["8xl"], 
    paddingHorizontal: SPACING.md,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  profileImage: {
    width: SPACING["9xl"],
    height: SPACING["9xl"],
    borderRadius: 100,
    borderWidth: 4,
    // borderColor: "rgba(0, 0, 0, 0.1)", // Not from any university
    borderColor: "rgba(0, 87, 172, .2)", // From University of Montreal
    // borderColor: "rgba(237, 27, 47, .2)", // From McGill University
  },
  profileInfo: {
    gap: SPACING.xxs,
  },
  profileName: {
    color: COLORS.black,
  },
  profileSubtitle: {
    color: COLORS.subtuleDark,
  },
  menuSection: {
    gap: 0,
    marginHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,

  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  menuItemText: {
    gap: 5,
  },
  menuItemTitle: {
    color: COLORS.black,
  },
  menuItemSubtitle: {
    color: COLORS.subtuleDark,
  },
  systemStatus: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  systemStatusTitle: {
    color: COLORS.black,
  },
  systemStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.status.green,
    position: 'relative',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.status.green,
    position: 'absolute',
    opacity: 0.5,
  },
  systemStatusText: {
    color: COLORS.status.green,
  },
  systemStatusSubtext: {
    color: COLORS.subtuleDark,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: '20%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btn: {
    borderRadius: 15,
    margin: 10,
    width: '60%',
    alignSelf: 'center',
  },
  orderBox :{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  orderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderRestaurant: {
    fontSize: 14,
    color: '#999',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clubText: {
    fontSize: 17, // taille de texte plus grande
    fontFamily: 'Arial', // police Calibri
    textAlign: 'justify',
    padding: 5,
  },
  socialText: {
    fontSize: 17,
    fontFamily: 'Arial',
    textAlign: 'justify',
    padding: 5,
  },
  policyText: {
    fontSize: 17,
    fontFamily: 'Arial',
    textAlign: 'justify',
    padding: 5,
  },  
  boldText: {
    fontSize: 21,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    lineHeight: 45,
    color: '#000033', // peut etre repeter cette couleur dans les autres parties
  },
  textContainer: {
    margin: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius:10,
  },
  // Additional styles for the modern modal
modernModalContainer: {
  width: '100%',
  maxHeight: '90%',
  backgroundColor: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.25,
  shadowRadius: 15,
  elevation: 10,
},
modernModalTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: COLORS.black,
},
modernModalContent: {
  padding: 20,
},
aboutSection: {
  marginBottom: 25,
},
helpSection: {
  marginBottom: 25,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 12,
  color: COLORS.black,
},
sectionSubtitle: {
  fontSize: 15,
  fontWeight: '600',
  lineHeight: 24,
  color: '#222'
},
sectionContent: {
  fontSize: 15,
  lineHeight: 24,
  color: '#555',
},
sectionIcon: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(0, 87, 172, 0.1)', // UdeM blue with transparency
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 15,
},
divider: {
  height: 1,
  backgroundColor: '#f0f0f0',
  marginVertical: 20,
},
socialIcons: {
  flexDirection: 'row',
  marginTop: 15,
  gap: 15,
  justifyContent: 'center',
  
},
socialButton: {
  width: 45,
  height: 45,
  borderRadius: 22.5,
  backgroundColor: 'rgba(0, 87, 172, 0.1)', // UdeM blue with transparency
  
  alignItems: 'center',
  justifyContent: 'center',
},
footerSection: {
  marginTop: 20,
  marginBottom: 20,
  alignItems: 'center',
  paddingVertical: 15,
},
versionText: {
  fontSize: 14,
  color: '#999',
  marginBottom: 5,
},
copyrightText: {
  fontSize: 12,
  color: '#999',
},
});
