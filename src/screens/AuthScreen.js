import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { API_URL } from '../config/api';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        username: username.trim(),
        password
      });

      await signIn(response.data.user);
    } catch (error) {
      console.error('Auth error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#000000' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="paper-plane" size={48} color="#8774E1" />
          </View>
          <Text style={styles.logo}>LITTOR</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Имя пользователя"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#8E8E93"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#8E8E93" 
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#8774E1' }]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            </Text>
            <Text style={[styles.switchTextBold, { color: '#8774E1' }]}>
              {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={16} color="#8E8E93" />
          <Text style={styles.footerText}>
            Защищенное соединение
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, justifyContent: 'space-between', padding: 32 },
  logoContainer: { alignItems: 'center', marginTop: 100 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', letterSpacing: 2, marginBottom: 8 },
  tagline: { fontSize: 15, color: '#8E8E93', textAlign: 'center' },
  form: { flex: 1, justifyContent: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, height: 52 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#FFFFFF' },
  eyeIcon: { padding: 4 },
  button: { flexDirection: 'row', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8, height: 52, backgroundColor: '#8774E1' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600', marginRight: 8 },
  switchButton: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchText: { color: '#8E8E93', fontSize: 15 },
  switchTextBold: { fontSize: 15, fontWeight: '600', color: '#8774E1' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  footerText: { color: '#8E8E93', fontSize: 13, marginLeft: 6 },
});
