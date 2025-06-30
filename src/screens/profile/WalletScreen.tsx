
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { mockPaymentMethods } from '../../data/mockData';
import Button from '../../components/common/Button';

const walletTransactions = [
  {
    id: '1',
    type: 'credit',
    amount: 500,
    description: 'Wallet top-up',
    date: '2024-01-15',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'debit',
    amount: 85,
    description: 'Ride payment',
    date: '2024-01-15',
    time: '09:30 AM',
  },
  {
    id: '3',
    type: 'credit',
    amount: 50,
    description: 'Referral bonus',
    date: '2024-01-14',
    time: '06:45 PM',
  },
];

export default function WalletScreen({ navigation }: any) {
  const [walletBalance] = useState(1250);
  const [selectedTab, setSelectedTab] = useState('wallet');

  const renderPaymentMethod = ({ item }: any) => (
    <TouchableOpacity style={styles.paymentMethodCard}>
      <View style={styles.paymentMethodLeft}>
        <View style={styles.paymentMethodIcon}>
          <Ionicons
            name={item.type === 'upi' ? 'card' : item.type === 'card' ? 'card' : 'cash'}
            size={24}
            color={Colors.primary}
          />
        </View>
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodName}>{item.name}</Text>
          <Text style={styles.paymentMethodIdentifier}>{item.identifier}</Text>
        </View>
      </View>
      <View style={styles.paymentMethodActions}>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.gray400} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            item.type === 'credit' ? styles.creditIcon : styles.debitIcon,
          ]}
        >
          <Ionicons
            name={item.type === 'credit' ? 'add' : 'remove'}
            size={20}
            color={Colors.white}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {item.date} • {item.time}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.type === 'credit' ? styles.creditAmount : styles.debitAmount,
        ]}
      >
        {item.type === 'credit' ? '+' : '-'}₹{item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet & Payments</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'wallet' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('wallet')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'wallet' && styles.activeTabText,
            ]}
          >
            Wallet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'payments' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('payments')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'payments' && styles.activeTabText,
            ]}
          >
            Payment Methods
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'wallet' ? (
          <>
            {/* Wallet Balance */}
            <View style={styles.walletCard}>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Wallet Balance</Text>
                <Text style={styles.balanceAmount}>₹{walletBalance}</Text>
              </View>
              <View style={styles.walletActions}>
                <Button
                  title="Add Money"
                  onPress={() => console.log('Add money')}
                  style={styles.addMoneyButton}
                />
                <TouchableOpacity style={styles.sendMoneyButton}>
                  <Ionicons name="send" size={20} color={Colors.primary} />
                  <Text style={styles.sendMoneyText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Add Amounts */}
            <View style={styles.quickAddCard}>
              <Text style={styles.quickAddTitle}>Quick Add</Text>
              <View style={styles.quickAddButtons}>
                {[100, 200, 500, 1000].map((amount) => (
                  <TouchableOpacity key={amount} style={styles.quickAddButton}>
                    <Text style={styles.quickAddText}>₹{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Transactions */}
            <View style={styles.transactionsCard}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Recent Transactions</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={walletTransactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          </>
        ) : (
          <>
            {/* Payment Methods */}
            <View style={styles.paymentMethodsCard}>
              <View style={styles.paymentMethodsHeader}>
                <Text style={styles.paymentMethodsTitle}>Saved Payment Methods</Text>
                <TouchableOpacity style={styles.addPaymentButton}>
                  <Ionicons name="add" size={20} color={Colors.primary} />
                  <Text style={styles.addPaymentText}>Add</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={mockPaymentMethods}
                renderItem={renderPaymentMethod}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>

            {/* Payment Settings */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Payment Settings</Text>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
                  <Text style={styles.settingText}>Auto-pay for rides</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="receipt" size={20} color={Colors.primary} />
                  <Text style={styles.settingText}>Payment receipts</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="lock-closed" size={20} color={Colors.accent} />
                  <Text style={styles.settingText}>Payment security</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Layout.spacing.sm,
  },
  headerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  helpButton: {
    padding: Layout.spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Layout.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  walletCard: {
    backgroundColor: Colors.primary,
    margin: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  balanceLabel: {
    fontSize: Layout.fontSize.md,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Layout.spacing.sm,
  },
  balanceAmount: {
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.white,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addMoneyButton: {
    flex: 1,
    backgroundColor: Colors.white,
    marginRight: Layout.spacing.md,
  },
  sendMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  sendMoneyText: {
    marginLeft: Layout.spacing.sm,
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  quickAddCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAddTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    backgroundColor: Colors.gray50,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
    alignItems: 'center',
  },
  quickAddText: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  transactionsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  transactionsTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  creditIcon: {
    backgroundColor: Colors.success,
  },
  debitIcon: {
    backgroundColor: Colors.error,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  transactionDate: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
  },
  creditAmount: {
    color: Colors.success,
  },
  debitAmount: {
    color: Colors.error,
  },
  paymentMethodsCard: {
    backgroundColor: Colors.white,
    margin: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  paymentMethodsTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  addPaymentText: {
    marginLeft: Layout.spacing.xs,
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentMethodIdentifier: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    marginRight: Layout.spacing.sm,
  },
  defaultText: {
    fontSize: Layout.fontSize.xs,
    fontWeight: '600',
    color: Colors.white,
  },
  moreButton: {
    padding: Layout.spacing.sm,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: Layout.spacing.md,
    fontSize: Layout.fontSize.md,
    color: Colors.text,
  },
});
