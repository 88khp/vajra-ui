import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import { AppBar, Box, ScreenWrapper } from 'vajra-ui';

import { useAppNavigation } from '../../../../../navigation/use-app-navigation';
import { AvatarHeader } from './comps/avatar-header';
import { MenuSection } from './sections/menu-section';

export const SettingsProfileScreen: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <ScreenWrapper>
      <AppBar.Header>
        <AppBar.BackAction icon={ArrowLeft} onPress={() => navigation.goBack()} />
        <AppBar.Title centered>Settings</AppBar.Title>
      </AppBar.Header>
      <ScrollView>
        <Box p="s-4" gap="s-6">
          <AvatarHeader name="Rishav Jha" email="rishav@example.com" initials="RJ" />
          <MenuSection />
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
};
