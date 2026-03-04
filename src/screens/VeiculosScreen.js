import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FrotaContext } from '../contexts/FrotaContext';

const VeiculosScreen = ({ navigation }) => {
  const { veiculos, removeVeiculo, loading } = useContext(FrotaContext);
  const [searchText, setSearchText] = useState('');

  const filteredVeiculos = veiculos.filter(veiculo =>
    veiculo.placa.toLowerCase().includes(searchText.toLowerCase()) ||
    veiculo.brandNome.toLowerCase().includes(searchText.toLowerCase()) ||
    veiculo.modelNome.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    // For now, all vehicles are active. In future, add status field
    return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', darkBg: '#14532d', darkText: '#86efac', darkBorder: '#166534' };
  };

  const getVehicleImage = (veiculo) => {
    // Placeholder images based on brand
    const images = {
      'Mercedes-Benz': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ3GfGSMuoofOZz7RBukSEQpKJs7nn1WQBmJVTa25mrsgEW5z9zxvFFpxbLTNgRXdGBIWq3Wn2Q2l7RZR_SsWvlD_yi50Uik3vWLqNk9h7gl6N6NcqYUpIsmn_PzuJJ5VW_dLh--IM0Al9OkoHU2DFasSDMpllCiL0HxqFKQAKCzJXHDq4-sOZv9XiCbQ8JxFZIs6KslN2lniZmu7tyxGKgJLxdhUXktxGVge_xMKVY5UXn-CBQ4usI9LoZ7DVlXzCGEzqJrqg3PY',
      'Volkswagen': 'https://lh3.googleusercontent.com/aida-public/AB6AXuARCvmiHuqWvfrIiT9oN81ffbZ9F2wjXWLtaO9TlXmN7XOrH12C4OMTatFaoZudsDvPQYXPERDX8yiEpLscSk_HaOmy12YSYeiQpNQ_AOA9FKR_9va-wA7HQAWMme3fGj32IvptfnRPvwJ7unntpIFXj0bzFZJ9vknvE7Vdt_D-1B9jzEJGnH0JydSGMj327_snEyH1IetQh0O9NZZjeyFFw3cRJt2QGKNz03_XOztTzj_5UZmcCT5AnT_UV1V-MTC-675pjQm5AIA',
      'Ford': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4VvHBhfeEj7oidLibLz9OfkY0CVDVbPXierI9d_yW8iU6Ylrz00wau7Bs5G1GVaiiDLjyHzuZD3PzT_FUyRrbWgsKQUoKl_keN8fDPfnnGCiVEDyfLrKryHJvv1PlxIEI_QLkeBLnhdhoFwnHMhTrmd-xxUHEGjb8lOiv8610BsJDCcpDpOjQnbvgr7aiXa1zpBsqTlje-S--2t7xXpSqmfJNPx0CJtGmRI91xjgdbaOJ4HwA2vN_eQ6jEXleYdWerCqQuGZynUM',
      'Chevrolet': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIo4z_o-0pOI5FgPBc22Ilae-Apc2-I8BixbJg34qCSa5MHuMCAG6K1FiNjTR1XfuqO9zxmZUTgrwR68xTpHKUrBqr1Mo5knb_CfR5q5K0mn0Gv5wYDr6IaZJIcQY_6AuLvj7UNZGAaI9UO4p7J3DIetUkBoPDdWyiU40aFYAHmzFzPXx7fKdtkLEb3UMWKzVPJZB5f2PP_73_7Ah21VJcPqV_yCIFuKiyQxyxe1NnOA4_3kqx1XmEmWDdrNYoXlfWIS88pMPZcRs'
    };
    return images[veiculo.brandNome] || 'https://via.placeholder.com/96x96?text=Veículo';
  };

  const handleRemove = (veiculo) => {
    Alert.alert(
      'Remover veículo',
      `Deseja remover ${veiculo.placa}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => removeVeiculo(veiculo.id)
        }
      ]
    );
  };

  const renderVehicleCard = ({ item }) => {
    const status = getStatusColor('ativo'); // Placeholder status
    return (
      <View style={styles.vehicleCard}>
        <Image source={{ uri: getVehicleImage(item) }} style={styles.vehicleImage} />
        <View style={styles.vehicleInfo}>
          <View style={styles.vehicleHeader}>
            <Text style={styles.vehiclePlate}>{item.placa}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
              <Text style={[styles.statusText, { color: status.text }]}>Ativo</Text>
            </View>
          </View>
          <Text style={styles.vehicleModel}>{item.brandNome} {item.modelNome} {item.ano}</Text>
          <View style={styles.vehicleDetails}>
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={14} color="#64748b" />
              <Text style={styles.detailText} numberOfLines={1}>João Silva</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={14} color="#64748b" />
              <Text style={styles.detailText} numberOfLines={1}>Av. Paulista, 1000 - São Paulo...</Text>
            </View>
          </View>
          <Text style={styles.timestamp}>15min atrás</Text>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={() => navigation.navigate('Abastecimento', { veiculoId: item.id })}
            >
              <MaterialIcons name="local-gas-station" size={16} color="#0284c7" />
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Abastecimentos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionBtnSecondary]}
              onPress={() => navigation.navigate('AgendarManutencao', { veiculoId: item.id })}
            >
              <MaterialIcons name="build" size={16} color="#059669" />
              <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>Manutenção</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('CadastroVeiculo', { veiculoId: item.id })} 
            style={styles.actionButton}
          >
            <MaterialIcons name="edit" size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemove(item)} style={styles.actionButton}>
            <MaterialIcons name="delete" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Veículos</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="filter-list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por placa ou modelo..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Vehicle List */}
      <FlatList
        data={filteredVeiculos}
        keyExtractor={item => item.id}
        renderItem={renderVehicleCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum veículo encontrado.</Text>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CadastroVeiculo')}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="dashboard" size={24} color="#64748b" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <MaterialIcons name="directions-car" size={24} color="#1e3a5f" />
          <Text style={[styles.navText, styles.navTextActive]}>Veículos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="build" size={24} color="#64748b" />
          <Text style={styles.navText}>Manutenção</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#64748b" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#1e3a5f',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 4,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    padding: 4,
    borderRadius: 8,
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for bottom nav
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  vehicleImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  cardActions: {
    justifyContent: 'center',
  },
  actionButton: {
    padding: 8,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vehicleModel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  vehicleDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnPrimary: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  actionBtnSecondary: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtnTextPrimary: {
    color: '#0284c7',
  },
  actionBtnTextSecondary: {
    color: '#059669',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#64748b',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    width: 56,
    height: 56,
    backgroundColor: '#ff7043',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#f1f5f9',
  },
  navText: {
    fontSize: 10,
    color: '#64748b',
  },
  navTextActive: {
    color: '#1e3a5f',
    fontWeight: '600',
  },
});

export default VeiculosScreen;
