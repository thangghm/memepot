import { MemeListPage } from './pages/MemeListPage';
import { PotPage } from './pages/PotPage';
import { SettingsPage } from './pages/SettingsPage';
import { TempotPage } from './pages/TempotPage';

interface RoutesProps {
  activeView: string;
  refreshToken: number;
  searchQuery: string;
}

export function Routes({ activeView, refreshToken, searchQuery }: RoutesProps) {
  switch (activeView) {
    case 'tempot':
      return <TempotPage refreshToken={refreshToken} searchQuery={searchQuery} />;
    case 'pot':
      return <PotPage refreshToken={refreshToken} searchQuery={searchQuery} />;
    case 'favorites':
      return (
        <MemeListPage
          title="Hot"
          refreshToken={refreshToken}
          options={{ favorite: true, query: searchQuery, status: 'active' }}
          emptyMessage="No Hot memes yet."
          sortable
        />
      );
    case 'hotpot':
      return (
        <MemeListPage
          title="HotPot"
          refreshToken={refreshToken}
          options={{ favorite: true, query: searchQuery, status: 'active' }}
          emptyMessage="No HotPot memes yet."
          sortable
        />
      );
    case 'trash':
      return (
        <MemeListPage
          title="Trash"
          refreshToken={refreshToken}
          options={{ status: 'trash', includeTrash: true, query: searchQuery, sort: 'created' }}
          emptyMessage="Trash is empty."
        />
      );
    case 'settings':
      return <SettingsPage />;
    default:
      return <TempotPage refreshToken={refreshToken} searchQuery={searchQuery} />;
  }
}
