import { Service } from '@/lib/types';

export type ServiceActionType = 'favorite' | 'delete' | 'feature' | 'edit' | 'website' | 'map' | 'profile' | 'login_required';

export interface ServiceAction {
  type: ServiceActionType;
  serviceId: string;
  payload?: any;
}

export interface ServiceCardProps {
  service: Service & { distance?: number };
  sortByDistance: boolean;
  userLocation: GeolocationCoordinates | null;
  delay?: number;
  onAction?: (action: ServiceAction) => void;
}

export interface ServiceImageProps {
  imageUrl?: string;
  name: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  isFavorited?: boolean;
}

export interface ServiceTypeBadgeProps {
  badgeConfig: {
    icon: any;
    label: string;
    bgColor: string;
    hoverColor: string;
  } | null;
}

export interface ServiceHeaderProps {
  service: Service;
  featured?: string;
  isAdminOrReviewer: boolean;
  onEdit: () => void;
}

export interface ServiceContentProps {
  service: Service;
  sortByDistance: boolean;
  userLocation: GeolocationCoordinates | null;
}

export interface ServiceActionButtonsProps {
  service: Service;
  user: any;
  isAdminOrReviewer: boolean;
  isFavorited: boolean;
  featured?: string;
  onAction: (action: ServiceAction) => void;
}

export interface ServiceModalsProps {
  service: Service;
  isAdminOrReviewer: boolean;
  isDeleteDialogOpen: boolean;
  isEditModalOpen: boolean;
  onDeleteClose: () => void;
  onEditClose: () => void;
  onDelete: () => void;
  onUpdate: (service: Service) => void;
} 