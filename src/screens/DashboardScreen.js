import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FrotaContext } from '../contexts/FrotaContext';

// Theme colors based on the reference design
const colors = {
  primary: '#FF6B3D',
  navy900: '#152E52',
  navy800: '#1E3A5F',
  backgroundLight: '#F8FAFC',
  cardBg: '#FFFFFF',
  cardBorder: '#F1F5F9',
  textPrimary: '#152E52',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.15)',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  warning: '#F97316',
  warningBg: '#FFEDD5',
};

const DashboardScreen = ({ navigation }) => {
  const { veiculos, manutencoes, abastecimentos } = useContext(FrotaContext);

  const totalVeiculos = veiculos.length;
  const emManutencao = manutencoes.filter(m => !m.concluida).length;
  const totalAbastecimentos = abastecimentos.length;

  // Mock alerts for demonstration
  const alertas = [
    {
      id: '1',
      tipo: 'danger',
      titulo: 'Manutenção Vencida',
      descricao: veiculos[0] ? `${veiculos[0].brandNome} ${veiculos[0].modelNome} - ${veiculos[0].placa}` : 'Nenhum veículo',
      tempo: '10 min',
      icon: 'warning',
    },
    {
      id: '2',
      tipo: 'warning',
      titulo: 'Revisão Programada',
      descricao: veiculos[1] ? `${veiculos[1].brandNome} ${veiculos[1].modelNome}` : 'Próxima revisão',
      tempo: '2h atrás',
      icon: 'build',
    },
  ];

  const StatCard = ({ label, value, subtitle, icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <MaterialIcons name={icon || 'help-outline'} size={16} color={colors.textMuted} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const AlertCard = ({ alerta }) => {
    const bgColor = alerta.tipo === 'danger' ? colors.dangerBg : colors.warningBg;
    const iconColor = alerta.tipo === 'danger' ? colors.danger : colors.warning;
    
    return (
      <View style={styles.alertCard}>
        <View style={[styles.alertIconContainer, { backgroundColor: bgColor }]}>
          <MaterialIcons name={alerta.icon} size={22} color={iconColor} />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{alerta.titulo}</Text>
          <Text style={styles.alertDesc}>{alerta.descricao}</Text>
        </View>
        <Text style={styles.alertTime}>{alerta.tempo}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>FleetControl</Text>
        </View>
        <View style={styles.statusBadge}>
          <MaterialIcons name="check-circle" size={14} color="#10B981" />
          <Text style={styles.statusText}>Ativo</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Fleet Overview Section */}
        <Text style={styles.sectionTitle}>Visão Geral da Frota</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
          <StatCard 
            label="Total Veículos" 
            value={totalVeiculos} 
            subtitle={`${emManutencao} em manutenção`}
            icon="directions-car"
          />
          <StatCard 
            label="Abastecimentos" 
            value={totalAbastecimentos} 
            subtitle="Este mês"
            icon="local-gas-station"
          />
          <StatCard 
            label="Manutenções" 
            value={manutencoes.length} 
            subtitle={`${emManutencao} pendentes`}
            icon="build"
          />
        </ScrollView>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapLabel}>
            <Text style={styles.mapLabelText}>Localização em Tempo Real</Text>
          </View>
          <MaterialIcons name="map" size={48} color={colors.textMuted} />
          <Text style={styles.mapPlaceholderText}>Mapa em breve</Text>
        </View>

        {/* Alerts Section */}
        <View style={styles.alertsHeader}>
          <Text style={styles.sectionTitle}>Alertas Recentes</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.alertsList}>
          {alertas.map(alerta => (
            <AlertCard key={alerta.id} alerta={alerta} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroVeiculo')}
      >
        <MaterialIcons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    backgroundColor: colors.navy900,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 150,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  mapPlaceholder: {
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mapPlaceholderText: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllLink: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  alertsList: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
  },
  alertIconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  alertDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  alertTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default DashboardScreen;
