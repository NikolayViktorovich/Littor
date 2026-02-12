import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function MyProfileScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');

  const handleSaveName = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
      setIsEditingName(false);
      Alert.alert('Success', 'Name updated');
    }
  };

  const handleSaveBio = () => {
    updateProfile({ bio: bio.trim() });
    setIsEditingBio(false);
    Alert.alert('Success', 'Bio updated');
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Photo picker coming soon!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileAvatar} onPress={handleChangePhoto}>
            <Text style={styles.profileAvatarText}>{profile.avatar}</Text>
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={20} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              {isEditingName ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    placeholder="Enter name"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                    <Ionicons name="checkmark" size={24} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      setName(profile.name);
                      setIsEditingName(false);
                    }} 
                    style={styles.cancelButton}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.infoValueContainer}
                  onPress={() => setIsEditingName(true)}
                >
                  <Text style={styles.infoValue}>{profile.name}</Text>
                  <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>@{profile.username}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BIO</Text>
          
          <View style={styles.card}>
            {isEditingBio ? (
              <View style={styles.bioEditContainer}>
                <TextInput
                  style={styles.bioInput}
                  value={bio}
                  onChangeText={setBio}
                  autoFocus
                  multiline
                  placeholder="Add a few words about yourself"
                  placeholderTextColor={colors.textTertiary}
                  maxLength={70}
                />
                <View style={styles.bioActions}>
                  <Text style={styles.bioCounter}>{bio.length}/70</Text>
                  <View style={styles.bioButtons}>
                    <TouchableOpacity onPress={handleSaveBio} style={styles.saveButton}>
                      <Ionicons name="checkmark" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => {
                        setBio(profile.bio || '');
                        setIsEditingBio(false);
                      }} 
                      style={styles.cancelButton}
                    >
                      <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.bioContainer}
                onPress={() => setIsEditingBio(true)}
              >
                <Text style={styles.bioText}>
                  {profile.bio || 'Add a few words about yourself'}
                </Text>
                <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileAvatarText: {
    fontSize: 48,
    fontWeight: '500',
    color: '#000000',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 8,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
    gap: 8,
  },
  editInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    padding: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    padding: 4,
  },
  cancelButton: {
    padding: 4,
  },
  bioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bioText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  bioEditContainer: {
    gap: 12,
  },
  bioInput: {
    color: colors.text,
    fontSize: 16,
    padding: 12,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bioActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bioCounter: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  bioButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});
