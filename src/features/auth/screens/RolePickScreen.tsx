import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BagIcon, BikeIcon } from '@/components/icons';
import { AppText, BrandHeader, Button, ScreenContainer, Spacer } from '@/components/ui';
import { colors, fontSize, spacing } from '@/theme';
import type { Role } from '@/utils/nav';

import { RoleCard } from '../components/RoleCard';

/** 00b-RolePick */
export default function RolePickScreen() {
  const [role, setRole] = useState<Role>('customer');
  const courier = role === 'courier';

  return (
    <ScreenContainer statusBar="light" paddingBottom={28}>
      <BrandHeader
        logoSize={72}
        title="اقضيها"
        titleSize={fontSize.display}
        subtitle="أهلاً بيك، قولّنا إنت مين"
        paddingTop={60}
        paddingBottom={44}
        gap={10}
        textGap={0}
      />

      <View style={styles.body}>
        <AppText size={fontSize.h2} weight="extrabold">
          هتستخدم التطبيق كـ
        </AppText>

        <RoleCard
          title="عميل"
          subtitle="عايز أطلب حاجة وتوصلّي لحد البيت"
          icon={<BagIcon size={32} color={colors.accentIcon} />}
          iconBg={colors.accentLight}
          selected={!courier}
          onPress={() => setRole('customer')}
        />
        <RoleCard
          title="مندوب"
          subtitle="عايز أوصّل طلبات وأكسب من كل مشوار"
          icon={<BikeIcon size={32} color={colors.primary} />}
          iconBg={colors.primaryTint}
          selected={courier}
          onPress={() => setRole('courier')}
        />

        <Spacer />

        <Button
          title={courier ? 'سجّل كمندوب' : 'إنشاء حساب جديد'}
          weight="extrabold"
          onPress={() => router.push(courier ? '/courier-phone' : '/phone')}
        />
        <Button
          variant="outline"
          title="عندي حساب، تسجيل الدخول"
          onPress={() => router.push({ pathname: '/login', params: { role } })}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: spacing.s28, paddingHorizontal: spacing.s20, gap: spacing.xl },
});
