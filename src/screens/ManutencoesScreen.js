import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ManutencoesScreen = ({ navigation }) => {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendamento de Manutenção</Text>
          <View style={styles.headerIconsRow}>
            <TouchableOpacity style={styles.headerBtn}>
              <MaterialIcons name="notifications" size={22} color="#fff" />
              <View style={styles.headerNotifDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <MaterialIcons name="more-vert" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Calendário fake */}
        <View style={styles.calendarBox}>
          <View style={styles.calendarHeaderRow}>
            <TouchableOpacity>
              <MaterialIcons name="chevron-left" size={22} color="#64748b" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.calendarMonth}>February</Text>
              <Text style={styles.calendarYear}>2026</Text>
            </View>
            <View style={styles.calendarHeaderRight}>
              <Text style={styles.calendarMonthType}>Month</Text>
              <TouchableOpacity>
                <MaterialIcons name="chevron-right" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Dias da semana */}
          <View style={styles.calendarDaysRow}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <Text key={d} style={styles.calendarDayLabel}>{d}</Text>
            ))}
          </View>
          {/* Dias do mês (mock) */}
          <View style={styles.calendarDatesGrid}>
            {[...Array(28)].map((_, i) => (
              <View key={i} style={styles.calendarDateCell}>
                <Text style={styles.calendarDateText}>{i+1}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Filtros */}
        <View style={styles.filtersBox}>
          <Text style={styles.filtersTitle}>Filtros</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
            <TouchableOpacity style={[styles.filterBtn, styles.filterBtnActive]}>
              <MaterialIcons name="filter-list" size={18} color="#fff" />
              <Text style={styles.filterBtnText}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <MaterialIcons name="schedule" size={18} color="#64748b" />
              <Text style={styles.filterBtnText}>Agendados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <MaterialIcons name="warning" size={18} color="#ff6b35" />
              <Text style={[styles.filterBtnText, { color: '#ff6b35' }]}>Atrasados</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* Próximas Manutenções */}
        <View style={styles.maintBox}>
          <View style={styles.maintHeaderRow}>
            <Text style={styles.maintHeader}>Próximas Manutenções</Text>
            <Text style={styles.maintCount}>6</Text>
          </View>
          {/* Card 1 */}
          <View style={styles.maintCard}>
            <View style={styles.maintCardHeaderRow}>
              <View>
                <Text style={styles.maintCardTitle}>Inspeção Geral</Text>
                <Text style={styles.maintCardSubtitle}>FL-004 - Iveco Daily</Text>
              </View>
              <Text style={styles.maintCardBadgeLow}>Baixa</Text>
            </View>
            <View style={styles.maintCardInfoRow}>
              <View style={styles.maintCardInfoItem}>
                <MaterialIcons name="calendar-today" size={16} color="#64748b" />
                <Text style={styles.maintCardInfoText}>27/01/2026</Text>
              </View>
              <Text style={styles.maintCardPrice}>R$ 450,00</Text>
            </View>
            <View style={styles.maintCardInfoItem}>
              <MaterialIcons name="business" size={16} color="#64748b" />
              <Text style={styles.maintCardInfoText}>Centro Automotivo Premium</Text>
            </View>
            <View style={styles.maintCardInfoItem}>
              <MaterialIcons name="speed" size={16} color="#64748b" />
              <Text style={styles.maintCardInfoText}>20000 km</Text>
            </View>
          </View>
          {/* Card 2 */}
          <View style={styles.maintCard}>
            <View style={styles.maintCardHeaderRow}>
              <View>
                <Text style={styles.maintCardTitle}>Serviço de Freios</Text>
                <Text style={styles.maintCardSubtitle}>ABC-1234 - Ford Transit</Text>
              </View>
              <Text style={styles.maintCardBadgeHigh}>Alta</Text>
            </View>
            <View style={styles.maintCardInfoRow}>
              <View style={styles.maintCardInfoItem}>
                <MaterialIcons name="calendar-today" size={16} color="#64748b" />
                <Text style={styles.maintCardInfoText}>12/02/2026</Text>
              </View>
              <Text style={styles.maintCardPrice}>R$ 1.200,00</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Botão agendar serviço */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.agendarBtn} onPress={() => navigation.navigate('AgendarManutencao', {})}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.agendarBtnText}>Agendar Serviço</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 8,
  },
  headerIconsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  headerNotifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1e3a8a',
  },
  calendarBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  calendarYear: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  calendarHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarMonthType: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginRight: 8,
  },
  calendarDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calendarDayLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
  },
  calendarDatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDateCell: {
    width: '13%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  calendarDateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  filtersBox: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterBtnActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  maintBox: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  maintHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  maintHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  maintCount: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  maintCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  maintCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  maintCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  maintCardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  maintCardBadgeLow: {
    backgroundColor: '#bbf7d0',
    color: '#22c55e',
    fontSize: 10,
    fontWeight: 'bold',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    textTransform: 'uppercase',
  },
  maintCardBadgeHigh: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    textTransform: 'uppercase',
  },
  maintCardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  maintCardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  maintCardInfoText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  maintCardPrice: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248,250,252,0.95)',
    padding: 16,
    zIndex: 50,
    alignItems: 'center',
  },
  agendarBtn: {
    backgroundColor: '#ff6b35',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
  },
  agendarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ManutencoesScreen;
