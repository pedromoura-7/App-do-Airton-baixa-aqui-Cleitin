import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, ScrollView, TouchableOpacity, Animated, Easing, Modal, TextInput, Alert, StatusBar, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// ===================== ASSETS =====================
const logoLoja = require('./assets/imagens/tukans.png');
const actionIcon = require('./assets/imagens/carrinho.png');

// ===================== MOCK LOGIN =====================
const VALID_USER = { email: 'cliente@tukans.com', password: '123456' };

// ===================== CATÁLOGO DE SERVIÇOS =====================
const SERVICES = [
  { name: 'Lavagem Premium', type: 'Lavagem', basePrice: '80,00', durationMin: 60, desc: 'Lavagem externa com cera rápida e acabamento nos detalhes.', emoji: '🚿' },
  { name: 'Higienização Interna', type: 'Higienização', basePrice: '220,00', durationMin: 120, desc: 'Aspiração profunda, limpeza de painéis e bancos (tecido).', emoji: '🧼' },
  { name: 'Higienização Couro', type: 'Higienização', basePrice: '260,00', durationMin: 120, desc: 'Limpeza suave e hidratação de bancos de couro.', emoji: '🪑' },
  { name: 'Polimento Técnico', type: 'Polimento', basePrice: '650,00', durationMin: 240, desc: 'Correção de pintura em múltiplas etapas e proteção.', emoji: '✨' },
  { name: 'Vitrificação de Pintura', type: 'Proteção', basePrice: '950,00', durationMin: 300, desc: 'Revestimento cerâmico com alta durabilidade.', emoji: '🛡️' },
  { name: 'Cristalização de Vidros', type: 'Proteção', basePrice: '180,00', durationMin: 60, desc: 'Tratamento hidrofóbico para para-brisa e vidros.', emoji: '💧' },
];

const ADDONS = [
  { name: 'Descontaminação (Clay Bar)', price: '120,00' },
  { name: 'Hidratação de Plásticos', price: '60,00' },
  { name: 'Black Piano Detail', price: '90,00' },
  { name: 'Oxi-Sanitização (O3)', price: '80,00' },
];

const VEHICLE_SIZE_FACTORS = {
  Pequeno: 1.0,
  Médio: 1.15,
  Grande: 1.30,
};

// ===================== HELPERS =====================
function priceStringToNumber(str) {
  if (!str) return 0;
  const clean = String(str).replace(/\./g, '').replace(',', '.');
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}
function formatCurrency(num) {
  return num.toFixed(2).replace('.', ',');
}
function addMinutesToTimeStr(timeStr, minutes) {
  const [hh, mm] = timeStr.split(':').map(Number);
  const total = hh * 60 + mm + minutes;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2,'0')}:${String(nm).padStart(2,'0')}`;
}
function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}
function generateTimeSlots() {
  const hrs = [];
  for (let h = 9; h <= 17; h++) {
    if (h === 12) continue;
    hrs.push(`${String(h).padStart(2,'0')}:00`);
  }
  return hrs;
}

// ===================== APP ROOT =====================
export default function App() {
  const [bootLoading, setBootLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (bootLoading) return <SplashScreen/>;
  if (!isLoggedIn) return <LoginScreen onSuccess={() => setIsLoggedIn(true)} />;
  return <DetailingHome onLogout={() => setIsLoggedIn(false)} />;
}

// ===================== SPLASH =====================
function SplashScreen(){
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.18, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <StatusBar barStyle="light-content" />
      <Animated.Image source={logoLoja} style={[styles.logo, { transform: [{ scale: scaleAnim }] }]} />
      <Text style={styles.title}>
        <Text style={{ color: '#FFD700' }}>Tu</Text>
        <Text style={{ color: '#4CAF50' }}>Kans</Text>
        <Text style={{ color: '#fff' }}> Detail</Text>
      </Text>
      <View style={styles.loadingBarContainer}>
        <Animated.View style={[styles.loadingBar, { transform: [{ scaleX: scaleAnim.interpolate({ inputRange: [1, 1.18], outputRange: [0.5, 1] }) }] }]} />
      </View>
      <Text style={styles.sloganMuted}>Dando brilho de showroom ao seu carro...</Text>
    </SafeAreaView>
  );
}

// ===================== LOGIN =====================
function LoginScreen({ onSuccess }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(){
    if (!email || !password) return Alert.alert('Campos obrigatórios', 'Informe e-mail e senha.');
    if (email.trim().toLowerCase() === VALID_USER.email && password === VALID_USER.password) {
      onSuccess();
    } else {
      Alert.alert('Falha no login', 'Use: cliente@tukans.com / 123456');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, { paddingTop: 80 }]}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Image source={logoLoja} style={{ width: 90, height: 90, marginBottom: 12 }} />
          <Text style={styles.titleHeader}>
            <Text style={{ color: '#FFD700' }}>Tu</Text>
            <Text style={{ color: '#4CAF50' }}>Kans</Text>
            <Text style={{ color: '#fff' }}> Detail</Text>
          </Text>
          <Text style={styles.slogan}>Estética automotiva premium ✨</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="seuemail@exemplo.com" placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Senha</Text>
          <View style={styles.passwordRow}>
            <TextInput value={password} onChangeText={setPassword} placeholder="••••••" placeholderTextColor="#888" secureTextEntry={!showPassword} style={[styles.input, { flex: 1, marginBottom: 0 }]} />
            <TouchableOpacity style={styles.showPwdBtn} onPress={() => setShowPassword(s => !s)}>
              <Text style={styles.showPwdText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>Dica: cliente@tukans.com / 123456</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ===================== HOME =====================
function DetailingHome({ onLogout }) {
  const [filter, setFilter] = useState('Todos');
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [vehicleSize, setVehicleSize] = useState('Pequeno');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [myBookingsVisible, setMyBookingsVisible] = useState(false);

  const types = ['Todos', ...new Set(SERVICES.map(s => s.type))];
  const filtered = filter === 'Todos' ? SERVICES : SERVICES.filter(s => s.type === filter);
  const timeSlots = generateTimeSlots();

  function toggleAddon(addon) {
    setSelectedAddons(prev => prev.some(a => a.name === addon.name) ? prev.filter(a => a.name !== addon.name) : [...prev, addon]);
  }

  function getCalculatedPrice() {
    if (!selectedService) return 0;
    const base = priceStringToNumber(selectedService.basePrice);
    const factor = VEHICLE_SIZE_FACTORS[vehicleSize] || 1;
    const addons = selectedAddons.reduce((s, a) => s + priceStringToNumber(a.price), 0);
    return base * factor + addons;
  }

  function openSchedule(service) {
    setSelectedService(service);
    setVehicleSize('Pequeno');
    setVehicleModel('');
    setVehiclePlate('');
    setSelectedAddons([]);
    setDateObj(new Date());
    setTimeStr('');
    setScheduleModal(true);
  }

  function toKeyDate(date) {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function isSlotAvailable(dateKey, start, durationMin) {
    const end = addMinutesToTimeStr(start, durationMin);
    const booked = appointments.filter(a => a.dateKey === dateKey).map(a => ({ start: a.start, end: a.end }));
    return booked.every(b => !rangesOverlap(start, end, b.start, b.end));
  }

  function confirmBooking() {
    if (!selectedService) return;
    if (!vehicleModel || !vehiclePlate) return Alert.alert('Dados do veículo', 'Informe modelo e placa.');
    if (!timeStr) return Alert.alert('Horário', 'Escolha um horário.');

    const dateKey = toKeyDate(dateObj);
    if (!isSlotAvailable(dateKey, timeStr, selectedService.durationMin)) {
      return Alert.alert('Horário indisponível', 'Escolha outro horário, já existe um serviço nesse período.');
    }

    const start = timeStr;
    const end = addMinutesToTimeStr(timeStr, selectedService.durationMin);
    const total = getCalculatedPrice();

    setAppointments(prev => [
      ...prev,
      {
        service: selectedService.name,
        type: selectedService.type,
        dateKey,
        dateStr: dateObj.toLocaleDateString('pt-BR'),
        start,
        end,
        durationMin: selectedService.durationMin,
        price: total,
        vehicle: { model: vehicleModel, plate: vehiclePlate, size: vehicleSize },
        addons: selectedAddons.map(a => a.name),
      }
    ]);

    setScheduleModal(false);
    Alert.alert('Agendamento criado', `Serviço: ${selectedService.name}\nData: ${dateObj.toLocaleDateString('pt-BR')} às ${start}\nTotal: R$ ${formatCurrency(total)}`);
  }

  function cancelBooking(index) {
    setAppointments(prev => prev.filter((_, i) => i !== index));
  }

  function MyBookingsModal() {
  return (
    <Modal transparent visible={myBookingsVisible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.cartModalContent]}>
          <View style={styles.cartModalHeader}>
            <Text style={styles.cartModalTitle}>Meus Agendamentos</Text>
            <TouchableOpacity onPress={() => setMyBookingsVisible(false)}>
              <Text style={styles.cartModalClose}>Fechar</Text>
            </TouchableOpacity>
          </View>

          {appointments.length === 0 ? (
            <Text style={{ color: '#bbb', textAlign: 'center', marginTop: 20 }}>Nenhum agendamento encontrado.</Text>
          ) : (
            <ScrollView>
              {appointments.map((a, idx) => (
                <View key={idx} style={styles.cartItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cartItemName}>{a.service} ({a.type})</Text>
                    <Text style={styles.cartItemPrice}>
                      {a.dateStr} às {a.start} ({a.durationMin} min)
                    </Text>
                    <Text style={styles.cartItemPrice}>
                      Veículo: {a.vehicle.model} • {a.vehicle.plate} • {a.vehicle.size}
                    </Text>
                    {a.addons.length > 0 && (
                      <Text style={styles.cartItemPrice}>Adicionais: {a.addons.join(', ')}</Text>
                    )}
                    <Text style={styles.cartItemSubtotal}>Total: R$ {formatCurrency(a.price)}</Text>

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => cancelBooking(idx)}
                    >
                      <Text style={styles.removeButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={logoLoja} style={styles.logoSmall} />
            <View>
              <Text style={styles.titleHeader}>
                <Text style={{ color: '#FFD700' }}>Tu</Text>
                <Text style={{ color: '#4CAF50' }}>Kans</Text>
                <Text style={{ color: '#fff' }}> Detail</Text>
              </Text>
              <Text style={styles.sloganSmall}>Estética automotiva • Brilho garantido</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginRight: 16 }} onPress={() => setMyBookingsVisible(true)}>
              <Text style={{ color: '#9BE7A1', fontWeight: 'bold' }}>Meus agendamentos ({appointments.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerRight} onPress={onLogout}>
              <Image source={actionIcon} style={styles.otherIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerInfoText}>Hoje: atendimento 09:00–18:00 (almoço 12:00–13:00). Reserve já! 😉</Text>
        </View>

        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          {types.map((t, i) => (
            <TouchableOpacity key={i} onPress={() => setFilter(t)} style={[styles.filterButton, filter === t && styles.filterButtonActive]}>
              <Text style={styles.filterText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Serviços */}
        <FlatList
          data={filtered}
          keyExtractor={(item, idx) => `${item.name}-${idx}`}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <View style={styles.serviceEmojiBox}><Text style={{ fontSize: 28 }}>{item.emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productType}>{item.type} • {item.durationMin} min</Text>
                <Text style={styles.productDesc}>{item.desc}</Text>
                <Text style={styles.productPrice}>A partir de R$ {item.basePrice}</Text>
              </View>
              <TouchableOpacity style={styles.cartButton} onPress={() => openSchedule(item)}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Agendar</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* MODAL: Agendamento */}
        <Modal transparent visible={scheduleModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { width: '92%', maxHeight: '80%' }]}>
              <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: 10 }}>
                <Text style={styles.modalTitle}>Agendar: {selectedService?.name}</Text>

                {/* Veículo */}
                <Text style={styles.inputLabel}>Modelo do veículo</Text>
                <TextInput style={styles.input} placeholder="Ex.: Corolla 2020" placeholderTextColor="#888" value={vehicleModel} onChangeText={setVehicleModel} />

                <Text style={styles.inputLabel}>Placa</Text>
                <TextInput style={styles.input} placeholder="ABC1D23" placeholderTextColor="#888" autoCapitalize="characters" value={vehiclePlate} onChangeText={setVehiclePlate} />

                <Text style={styles.inputLabel}>Port do veículo</Text>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  {Object.keys(VEHICLE_SIZE_FACTORS).map(sz => (
                    <TouchableOpacity key={sz} onPress={() => setVehicleSize(sz)} style={[styles.chip, vehicleSize === sz && styles.chipActive]}>
                      <Text style={styles.chipText}>{sz}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Data */}
                <Text style={styles.inputLabel}>Data</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowDatePicker(true)}>
                  <Text style={{ color: 'white' }}>{dateObj ? dateObj.toLocaleDateString('pt-BR') : 'Selecione a data'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dateObj || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, date) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (date) setDateObj(date);
                    }}
                    minimumDate={new Date()}
                  />
                )}

                {/* Horário */}
                <Text style={[styles.inputLabel, { marginTop: 6 }]}>Horário</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {timeSlots.map(t => {
                    const duration = selectedService?.durationMin || 60;
                    const key = toKeyDate(dateObj);
                    const available = key ? isSlotAvailable(key, t, duration) : true;
                    const active = timeStr === t;
                    return (
                      <TouchableOpacity key={t} disabled={!available || !key} onPress={() => setTimeStr(t)} style={[styles.timeSlot, active && styles.timeSlotActive, (!available || !key) && styles.timeSlotDisabled]}>
                        <Text style={[styles.timeSlotText, (!available || !key) && { color: '#777' }]}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Adicionais */}
                <Text style={[styles.inputLabel, { marginTop: 10 }]}>Adicionais</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {ADDONS.map(ad => {
                    const sel = selectedAddons.some(a => a.name === ad.name);
                    return (
                      <TouchableOpacity key={ad.name} onPress={() => toggleAddon(ad)} style={[styles.chip, sel && styles.chipActive]}>
                        <Text style={styles.chipText}>{ad.name} • R$ {ad.price}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Resumo */}
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryTitle}>Resumo</Text>
                  <Text style={styles.summaryLine}>Serviço: <Text style={styles.summaryStrong}>{selectedService?.name || '-'}</Text></Text>
                  <Text style={styles.summaryLine}>Veículo: {vehicleModel || '-'} • {vehiclePlate || '-'} • {vehicleSize}</Text>
                  <Text style={styles.summaryLine}>Data/Hora: {dateObj?.toLocaleDateString('pt-BR') || '-'} {timeStr || ''}</Text>
                  <Text style={styles.summaryLine}>Duração: {selectedService?.durationMin || 0} min</Text>
                  {selectedAddons.length > 0 && (
                    <Text style={styles.summaryLine}>Adicionais: {selectedAddons.map(a => a.name).join(', ')}</Text>
                  )}
                  <Text style={styles.summaryTotal}>Total: R$ {formatCurrency(getCalculatedPrice())}</Text>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setScheduleModal(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmBooking}>
                  <Text style={styles.modalButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>

      <MyBookingsModal />

    </SafeAreaView>
  );
}


// ===================== STYLES =====================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, padding: 12, paddingTop: 60 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { padding: 10 },
  logoSmall: { width: 50, height: 50, marginRight: 10 },
  titleHeader: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  sloganSmall: { color: '#aaa', fontSize: 12, marginTop: 2 },

  bannerInfo: { backgroundColor: '#1E1E1E', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#222', marginBottom: 10 },
  bannerInfoText: { color: '#ddd', textAlign: 'center' },

  otherIcon: { width: 26, height: 26, tintColor: '#ff8a80' },

  filterBar: { marginBottom: 10, flexGrow: 0 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#333', borderRadius: 8, marginRight: 8 },
  filterButtonActive: { backgroundColor: '#4CAF50' },
  filterText: { color: 'white', fontWeight: 'bold' },

  serviceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 12, marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#222' },
  serviceEmojiBox: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  serviceEmojiBoxSm: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },

  productName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  productType: { color: '#aaa', fontSize: 13, marginTop: 2 },
  productDesc: { color: '#bbb', fontSize: 12, marginTop: 6 },
  productPrice: { color: '#4CAF50', fontSize: 15, fontWeight: 'bold', marginTop: 8 },

  cartButton: { paddingVertical: 10, paddingHorizontal: 12, marginLeft: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32', borderRadius: 8 },

  loadingContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: 'white' },
  sloganMuted: { color: '#aaa', marginTop: 10 },
  loadingBarContainer: { width: 200, height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden', marginTop: 20 },
  loadingBar: { height: 6, backgroundColor: '#4CAF50', borderRadius: 3 },

  loginCard: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#222' },
  inputLabel: { color: '#ddd', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#2A2A2A', color: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 10 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  showPwdBtn: { marginLeft: 8, backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#3a3a3a' },
  showPwdText: { color: 'white', fontWeight: 'bold' },
  loginButton: { marginTop: 16, backgroundColor: '#4CAF50', padding: 14, borderRadius: 10 },
  loginButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  helperText: { color: '#888', fontSize: 12, textAlign: 'center', marginTop: 12 },

  chip: { backgroundColor: '#2A2A2A', borderWidth: 1, borderColor: '#333', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 999, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  chipText: { color: 'white', fontSize: 12, fontWeight: '600' },
  timeSlot: { backgroundColor: '#2A2A2A', borderWidth: 1, borderColor: '#333', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  timeSlotActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  timeSlotDisabled: { backgroundColor: '#1a1a1a', borderColor: '#222' },
  timeSlotText: { color: 'white', fontSize: 12, fontWeight: '600' },

  summaryBox: { backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#222', borderRadius: 10, padding: 12, marginTop: 10 },
  summaryTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 6 },
  summaryLine: { color: '#bbb', marginTop: 2 },
  summaryStrong: { color: '#fff', fontWeight: 'bold' },
  summaryTotal: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', marginTop: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#121212', borderRadius: 12, padding: 16 },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  modalButtonCancel: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#333', borderRadius: 8 },
  modalButtonConfirm: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#4CAF50', borderRadius: 8 },
  modalButtonText: { color: 'white', fontWeight: 'bold' },

  cartModalContent: { backgroundColor: '#121212', flex: 1, paddingTop: 50, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cartModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  cartModalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cartModalClose: { color: '#FF5252', fontWeight: 'bold' },
  cartItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1E1E1E', borderRadius: 10, padding: 10, marginHorizontal: 16, marginBottom: 10 },
  cartItemName: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  cartItemPrice: { color: '#bbb', fontSize: 12 },
  cartItemSubtotal: { color: '#4CAF50', fontWeight: 'bold', marginTop: 4 },
  cartQtyRow: { flexDirection: 'row', marginTop: 6 },
  removeButton: { backgroundColor: '#FF5252', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  removeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});
