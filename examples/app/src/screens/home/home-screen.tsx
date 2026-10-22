import { ArrowRight, LayoutGrid, Palette, Zap } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import {
  AppBar,
  Box,
  Card,
  IconBox,
  Pressable,
  ScreenWrapper,
  Text,
} from 'vajra-ui';

import { useAppNavigation } from '../../navigation/use-app-navigation';

function NavCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} activeOpacity={0.75}>
      <Card p="s-4" rounded="r-3" borderWidth={1} borderColor="border" gap="s-3">
        <Box direction="row" align="center" justify="space-between">
          {icon}
          <ArrowRight size={16} color="gray" />
        </Box>
        <Box gap="s-1">
          <Text variant="labelMedium">{title}</Text>
          <Text variant="caption" color="textMuted">{description}</Text>
        </Box>
      </Card>
    </Pressable>
  );
}

export function HomeScreen() {
  const navigation = useAppNavigation();

  return (
    <ScreenWrapper>
      <AppBar.Header>
        <AppBar.Title centered>⚡️ Vajra UI</AppBar.Title>
        <AppBar.IconButton
          icon={Palette}
          onPress={() => navigation.navigate('ThemeSwitcher')}
        />
      </AppBar.Header>
      <ScrollView>
        <Box p="s-4" gap="s-8">

          {/* Hero */}
          <Box gap="s-3" align="center" py="s-8">
            <Box
              w={72}
              h={72}
              rounded="r-3"
              bg="primary"
              align="center"
              justify="center"
            >
              <Zap size={36} color="white" />
            </Box>
            <Box gap="s-1" align="center">
              <Text variant="h2">88khp · Vajra UI</Text>
              <Text variant="body" color="textMuted" style={{ textAlign: 'center' }}>
                A minimal, token-driven React Native{'\n'}component library.
              </Text>
            </Box>
            <Box direction="row" gap="s-2" align="center" py="s-1">
              <Box w={8} h={8} rounded="r-full" bg="primary" />
              <Box w={8} h={8} rounded="r-full" bg="secondary" />
              <Box w={8} h={8} rounded="r-full" bg="success" />
              <Box w={8} h={8} rounded="r-full" bg="warning" />
              <Box w={8} h={8} rounded="r-full" bg="info" />
            </Box>
          </Box>

          {/* Navigation cards */}
          <Box gap="s-3">
            <NavCard
              icon={<IconBox icon={Zap} bg="primarySubtle" iconColor="primary" />}
              title="See Examples"
              description="10 real app UIs built purely with Vajra UI components — no StyleSheet, minimum tokens."
              onPress={() => navigation.navigate('ExamplesList')}
            />
            <NavCard
              icon={<IconBox icon={LayoutGrid} bg="secondarySubtle" iconColor="secondary" />}
              title="Component List"
              description="Browse all components with live previews, props, and interactive examples."
              onPress={() => navigation.navigate('ComponentList')}
            />
          </Box>

          {/* Footer */}
          <Box align="center" py="s-4">
            <Text variant="caption" color="textDisabled">
              Built by 88khp
            </Text>
          </Box>

        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}
