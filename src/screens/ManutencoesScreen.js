import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FrotaContext } from '../contexts/FrotaContext';

const ManutencoesScreen = ({ navigation }) => {
  const { manutencoes, removeManutencao } = useContext(FrotaContext);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removeManutencao(id) }
      ]
    );
  };

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
        {/* Calendário fake (omitido para brevidade ou mantido como visual) */}
        <View style={styles.calendarBox}>
          {/* ... calendar content ... */}
          <View style={styles.calendarHeaderRow}>
            <TouchableOpacity><MaterialIcons name="chevron-left" size={22} color="#64748b" /></TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.calendarMonth}>Agendamentos</Text>
              <Text style={styles.calendarYear}>Visão de Lista</Text>
            </View>
            <TouchableOpacity><MaterialIcons name="chevron-right" size={22} color="#64748b" /></TouchableOpacity>
          </View>
        </View>

        {/* Próximas Manutenções */}
        <View style={styles.maintBox}>
          <View style={styles.maintHeaderRow}>
            <Text style={styles.maintHeader}>Agendamentos Gravados</Text>
            <Text style={styles.maintCount}>{manutencoes.length}</Text>
          </View>
          
          {manutencoes.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialIcons name="event-busy" size={48} color="#cbd5e1" />
              <Text style={{ color: '#64748b', marginTop: 12 }}>Nenhum agendamento encontrado.</Text>
            </View>
          ) : (
            manutencoes.map((item) => (
              <View key={item.id} style={styles.maintCard}>
                <View style={styles.maintCardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.maintCardTitle}>{item.tipoServico}</Text>
                    <Text style={styles.maintCardSubtitle}>{item.veiculo}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={
                      item.urgencia === 'Alta' ? styles.maintCardBadgeHigh : 
                      item.urgencia === 'Média' ? styles.maintCardBadgeMed : 
                      styles.maintCardBadgeLow
                    }>{item.urgencia}</Text>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.maintCardInfoRow}>
                  <View style={styles.maintCardInfoItem}>
                    <MaterialIcons name="calendar-today" size={16} color="#64748b" />
                    <Text style={styles.maintCardInfoText}>{item.dataPrevista}</Text>
                  </View>
                  <Text style={styles.maintCardPrice}>R$ {item.custo || '0,00'}</Text>
                </View>
                {item.prestador && (
                  <View style={styles.maintCardInfoItem}>
                    <MaterialIcons name="business" size={16} color="#64748b" />
                    <Text style={styles.maintCardInfoText}>{item.prestador}</Text>
                  </View>
                )}
                {item.km && (
                  <View style={styles.maintCardInfoItem}>
                    <MaterialIcons name="speed" size={16} color="#64748b" />
                    <Text style={styles.maintCardInfoText}>{item.km} km</Text>
                  </View>
                )}
              </View>
            ))
          )}
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
  maintCardBadgeMed: {
    backgroundColor: '#fff7ed',
    color: '#fb923c',
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
