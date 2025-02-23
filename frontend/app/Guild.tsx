import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/themes/Colors';
import { Ionicons } from '@expo/vector-icons';

// Enable smooth layout animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Guild = {
  name: string;
  password: string;
};

const Guild: React.FC = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [guildName, setGuildName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCreateVisible, setCreateVisible] = useState<boolean>(false);
  const [isJoinVisible, setJoinVisible] = useState<boolean>(false);

  const toggleCreateDropdown = () => {
    LayoutAnimation.easeInEaseOut();
    setCreateVisible(!isCreateVisible);
    setJoinVisible(false); // Ensure only one dropdown is open
  };

  const toggleJoinDropdown = () => {
    LayoutAnimation.easeInEaseOut();
    setJoinVisible(!isJoinVisible);
    setCreateVisible(false); // Ensure only one dropdown is open
  };

  const handleCreateGuild = () => {
    if (!guildName.trim() || !password.trim()) return;
    
    if (guilds.find(g => g.name === guildName)) {
      console.warn('Guild name already exists!');
      return;
    }

    const newGuild: Guild = { name: guildName, password };
    setGuilds([...guilds, newGuild]);

    console.log('Created Guild:', newGuild);
    resetForm();
    setCreateVisible(false);
  };

  const handleJoinGuild = () => {
    const existingGuild = guilds.find(g => g.name === guildName && g.password === password);
    if (!existingGuild) {
      console.warn('Guild not found or incorrect password!');
      return;
    }

    console.log('Joined Guild:', guildName);
    resetForm();
    setJoinVisible(false);
  };

  const resetForm = () => {
    setGuildName('');
    setPassword('');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Create Guild Button */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCreateDropdown}>
        <ThemedText style={styles.buttonText}>
          {isCreateVisible ? 'Cancel' : 'Create Guild'}
        </ThemedText>
        <Ionicons name={isCreateVisible ? 'chevron-up' : 'chevron-down'} size={20} color="#fff" />
      </TouchableOpacity>

      {/* Create Guild Dropdown */}
      {isCreateVisible && (
        <View style={styles.dropdown}>
          <TextInput
            style={styles.input}
            placeholder="Guild Name"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={guildName}
            onChangeText={setGuildName}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.actionButton} onPress={handleCreateGuild}>
            <ThemedText style={styles.actionButtonText}>Create</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Join Guild Button */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleJoinDropdown}>
        <ThemedText style={styles.buttonText}>
          {isJoinVisible ? 'Cancel' : 'Join Guild'}
        </ThemedText>
        <Ionicons name={isJoinVisible ? 'chevron-up' : 'chevron-down'} size={20} color="#fff" />
      </TouchableOpacity>

      {/* Join Guild Dropdown */}
      {isJoinVisible && (
        <View style={styles.dropdown}>
          <TextInput
            style={styles.input}
            placeholder="Guild Name"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={guildName}
            onChangeText={setGuildName}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.actionButton} onPress={handleJoinGuild}>
            <ThemedText style={styles.actionButtonText}>Join</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  toggleButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.light.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  dropdown: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(4, 36, 124, 0.95)',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    fontSize: 16,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#5476DE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Guild;
