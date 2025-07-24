export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "2022holisticvets": {
        Row: {
          "Accuracy Score": number | null
          "Accuracy Type": string | null
          Category: string | null
          City: string | null
          City_1: string | null
          "Clinic/School Name": string | null
          Country: string | null
          County: string | null
          "First Name": string | null
          ID: string
          "Last Name": string | null
          Latitude: number | null
          Longitude: number | null
          Number: string | null
          Source: string | null
          State: string | null
          State_1: string | null
          Street: string | null
          "Street Address": string | null
          "Unit Number": string | null
          "Unit Type": string | null
          "Vet Title": string | null
          Zip: string | null
          Zip_1: number | null
        }
        Insert: {
          "Accuracy Score"?: number | null
          "Accuracy Type"?: string | null
          Category?: string | null
          City?: string | null
          City_1?: string | null
          "Clinic/School Name"?: string | null
          Country?: string | null
          County?: string | null
          "First Name"?: string | null
          ID: string
          "Last Name"?: string | null
          Latitude?: number | null
          Longitude?: number | null
          Number?: string | null
          Source?: string | null
          State?: string | null
          State_1?: string | null
          Street?: string | null
          "Street Address"?: string | null
          "Unit Number"?: string | null
          "Unit Type"?: string | null
          "Vet Title"?: string | null
          Zip?: string | null
          Zip_1?: number | null
        }
        Update: {
          "Accuracy Score"?: number | null
          "Accuracy Type"?: string | null
          Category?: string | null
          City?: string | null
          City_1?: string | null
          "Clinic/School Name"?: string | null
          Country?: string | null
          County?: string | null
          "First Name"?: string | null
          ID?: string
          "Last Name"?: string | null
          Latitude?: number | null
          Longitude?: number | null
          Number?: string | null
          Source?: string | null
          State?: string | null
          State_1?: string | null
          Street?: string | null
          "Street Address"?: string | null
          "Unit Number"?: string | null
          "Unit Type"?: string | null
          "Vet Title"?: string | null
          Zip?: string | null
          Zip_1?: number | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url: string
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          service_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["contact_status"]
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dogparks: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          "categories/8": string | null
          "categories/9": string | null
          categoryName: string | null
          cid: number
          city: string | null
          countryCode: string | null
          fid: string
          HotelStars: number | null
          imageUrl: string | null
          isAdvertisement: boolean | null
          "location/lat": number | null
          "location/lng": number | null
          neighborhood: string | null
          permanentlyClosed: boolean | null
          placeId: string | null
          postalCode: number | null
          price: string | null
          rank: number | null
          reviewsCount: number | null
          searchPageUrl: string | null
          searchString: string | null
          senttonextfly: boolean | null
          state: string | null
          street: string | null
          temporarilyClosed: boolean | null
          title: string | null
          totalScore: number | null
          url: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          categoryName?: string | null
          cid: number
          city?: string | null
          countryCode?: string | null
          fid: string
          HotelStars?: number | null
          imageUrl?: string | null
          isAdvertisement?: boolean | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          neighborhood?: string | null
          permanentlyClosed?: boolean | null
          placeId?: string | null
          postalCode?: number | null
          price?: string | null
          rank?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          senttonextfly?: boolean | null
          state?: string | null
          street?: string | null
          temporarilyClosed?: boolean | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          categoryName?: string | null
          cid?: number
          city?: string | null
          countryCode?: string | null
          fid?: string
          HotelStars?: number | null
          imageUrl?: string | null
          isAdvertisement?: boolean | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          neighborhood?: string | null
          permanentlyClosed?: boolean | null
          placeId?: string | null
          postalCode?: number | null
          price?: string | null
          rank?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          senttonextfly?: boolean | null
          state?: string | null
          street?: string | null
          temporarilyClosed?: boolean | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          action: string
          additional_data: Json | null
          context: string
          created_at: string | null
          error_message: string
          id: string
          stack_trace: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          additional_data?: Json | null
          context: string
          created_at?: string | null
          error_message: string
          id?: string
          stack_trace?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          additional_data?: Json | null
          context?: string
          created_at?: string | null
          error_message?: string
          id?: string
          stack_trace?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          service_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      groomers: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          "categories/8": string | null
          categoryName: string | null
          city: string | null
          description: string | null
          fid: string
          imageUrl: string | null
          locatedIn: string | null
          "location/lat": number | null
          "location/lng": number | null
          phone: string | null
          postalCode: number | null
          searchPageUrl: string | null
          searchString: string | null
          state: string | null
          street: string | null
          title: string | null
          totalScore: number | null
          url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid: string
          imageUrl?: string | null
          locatedIn?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid?: string
          imageUrl?: string | null
          locatedIn?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      "holistic-vets": {
        Row: {
          "Accuracy Score": number | null
          "Accuracy Type": string | null
          "Address (City)": string | null
          "Address (Country)": string | null
          "Address (Postal Code)": string | null
          "Address (State/Province)": string | null
          "Address (Street)": string | null
          Category: string | null
          City: string | null
          Country: string | null
          County: string | null
          "First Name": string | null
          ID: number
          "Last Name": string | null
          Latitude: string | null
          Latitude_1: number | null
          Longitude: number | null
          Number: string | null
          Source: string | null
          State: string | null
          Street: string | null
          "Unit Number": string | null
          "Unit Type": string | null
          "Veterinary Degree(s)": string | null
          Zip: number | null
        }
        Insert: {
          "Accuracy Score"?: number | null
          "Accuracy Type"?: string | null
          "Address (City)"?: string | null
          "Address (Country)"?: string | null
          "Address (Postal Code)"?: string | null
          "Address (State/Province)"?: string | null
          "Address (Street)"?: string | null
          Category?: string | null
          City?: string | null
          Country?: string | null
          County?: string | null
          "First Name"?: string | null
          ID: number
          "Last Name"?: string | null
          Latitude?: string | null
          Latitude_1?: number | null
          Longitude?: number | null
          Number?: string | null
          Source?: string | null
          State?: string | null
          Street?: string | null
          "Unit Number"?: string | null
          "Unit Type"?: string | null
          "Veterinary Degree(s)"?: string | null
          Zip?: number | null
        }
        Update: {
          "Accuracy Score"?: number | null
          "Accuracy Type"?: string | null
          "Address (City)"?: string | null
          "Address (Country)"?: string | null
          "Address (Postal Code)"?: string | null
          "Address (State/Province)"?: string | null
          "Address (Street)"?: string | null
          Category?: string | null
          City?: string | null
          Country?: string | null
          County?: string | null
          "First Name"?: string | null
          ID?: number
          "Last Name"?: string | null
          Latitude?: string | null
          Latitude_1?: number | null
          Longitude?: number | null
          Number?: string | null
          Source?: string | null
          State?: string | null
          Street?: string | null
          "Unit Number"?: string | null
          "Unit Type"?: string | null
          "Veterinary Degree(s)"?: string | null
          Zip?: number | null
        }
        Relationships: []
      }
      ilvets: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          "categories/8": string | null
          "categories/9": string | null
          city: string | null
          description: string | null
          fid: string
          imagesCount: number | null
          imageUrl: string | null
          "location/lat": number | null
          "location/lng": number | null
          phone: string | null
          postalCode: number | null
          rank: number | null
          reviewsCount: number | null
          searchPageUrl: string | null
          searchString: string | null
          state: string | null
          street: string | null
          title: string | null
          totalScore: number | null
          url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          city?: string | null
          description?: string | null
          fid: string
          imagesCount?: number | null
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          rank?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          city?: string | null
          description?: string | null
          fid?: string
          imagesCount?: number | null
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          rank?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      indvets: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          "categories/8": string | null
          "categories/9": string | null
          city: string | null
          description: string | null
          fid: string
          imageUrl: string | null
          "location/lat": number | null
          "location/lng": number | null
          phone: string | null
          postalCode: number | null
          reviewsCount: number | null
          searchPageUrl: string | null
          searchString: string | null
          state: string | null
          street: string | null
          title: string | null
          totalScore: number | null
          url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          city?: string | null
          description?: string | null
          fid: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          city?: string | null
          description?: string | null
          fid?: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      michiganvets: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/10": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          "categories/8": string | null
          "categories/9": string | null
          categoryName: string | null
          city: string | null
          description: string | null
          fid: string
          imageUrl: string | null
          "location/lat": number | null
          "location/lng": number | null
          phone: string | null
          postalCode: number | null
          reviewsCount: number | null
          searchPageUrl: string | null
          searchString: string | null
          state: string | null
          street: string | null
          title: string | null
          totalScore: number | null
          url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/10"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/10"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid?: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      ohiovets: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          "categories/8": string | null
          "categories/9": string | null
          categoryName: string | null
          city: string | null
          description: string | null
          fid: string
          imageUrl: string | null
          "location/lat": number | null
          "location/lng": number | null
          phone: string | null
          postalCode: number | null
          reviewsCount: number | null
          searchPageUrl: string | null
          searchString: string | null
          state: string | null
          street: string | null
          title: string | null
          totalScore: number | null
          url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          "categories/8"?: string | null
          "categories/9"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid?: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      page_view_analytics: {
        Row: {
          created_at: string | null
          id: string
          page_title: string
          page_url: string
          session_id: string
          time_spent: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_title: string
          page_url: string
          session_id: string
          time_spent?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_title?: string
          page_url?: string
          session_id?: string
          time_spent?: number
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accept_titer_exemption: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          open_to_public: boolean | null
          pet_breed: string | null
          pet_favorite_tricks: string[] | null
          pet_name: string | null
          pet_photos: string[] | null
          profile_photo: string | null
          role: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          accept_titer_exemption?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          open_to_public?: boolean | null
          pet_breed?: string | null
          pet_favorite_tricks?: string[] | null
          pet_name?: string | null
          pet_photos?: string[] | null
          profile_photo?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          accept_titer_exemption?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          open_to_public?: boolean | null
          pet_breed?: string | null
          pet_favorite_tricks?: string[] | null
          pet_name?: string | null
          pet_photos?: string[] | null
          profile_photo?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          helpful_count: number | null
          id: string
          rating: number
          review_text: string | null
          service_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          rating: number
          review_text?: string | null
          service_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          rating?: number
          review_text?: string | null
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          created_at: string | null
          id: string
          page_number: number
          results_count: number
          search_term: string
          service_type: string | null
          session_id: string
          state: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_number?: number
          results_count?: number
          search_term: string
          service_type?: string | null
          session_id: string
          state?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_number?: number
          results_count?: number
          search_term?: string
          service_type?: string | null
          session_id?: string
          state?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      service_definitions: {
        Row: {
          badge_color: string
          created_at: string
          id: number
          service_name: string | null
          service_type: string | null
        }
        Insert: {
          badge_color?: string
          created_at?: string
          id?: number
          service_name?: string | null
          service_type?: string | null
        }
        Update: {
          badge_color?: string
          created_at?: string
          id?: number
          service_name?: string | null
          service_type?: string | null
        }
        Relationships: []
      }
      service_details: {
        Row: {
          attribute_name: string
          attribute_value: string
          created_at: string | null
          id: string
          service_id: string
        }
        Insert: {
          attribute_name: string
          attribute_value: string
          created_at?: string | null
          id?: string
          service_id: string
        }
        Update: {
          attribute_name?: string
          attribute_value?: string
          created_at?: string | null
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_details_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_submissions: {
        Row: {
          address: string
          admin_notes: string | null
          city: string
          contact_phone: string
          created_at: string | null
          description: string
          email: string
          facebook_url: string | null
          geocoding_error: string | null
          geocoding_status: string | null
          id: string
          instagram_url: string | null
          latitude: number
          longitude: number
          name: string
          pet_description: string | null
          pets_name: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          state: string
          status: Database["public"]["Enums"]["submission_status"]
          twitter_url: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
          zip_code: string
        }
        Insert: {
          address: string
          admin_notes?: string | null
          city: string
          contact_phone: string
          created_at?: string | null
          description: string
          email: string
          facebook_url?: string | null
          geocoding_error?: string | null
          geocoding_status?: string | null
          id?: string
          instagram_url?: string | null
          latitude: number
          longitude: number
          name: string
          pet_description?: string | null
          pets_name?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          state: string
          status?: Database["public"]["Enums"]["submission_status"]
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          admin_notes?: string | null
          city?: string
          contact_phone?: string
          created_at?: string | null
          description?: string
          email?: string
          facebook_url?: string | null
          geocoding_error?: string | null
          geocoding_status?: string | null
          id?: string
          instagram_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          pet_description?: string | null
          pets_name?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          state?: string
          status?: Database["public"]["Enums"]["submission_status"]
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          address: string
          city: string
          contact_phone: string | null
          created_at: string | null
          description: string
          email: string | null
          facebook_url: string | null
          featured: string | null
          geocoding_error: string | null
          geocoding_status: string | null
          gMapsID: string | null
          id: string
          image_url: string | null
          instagram_url: string | null
          is_verified: boolean | null
          latitude: number
          longitude: number
          name: string
          name_description_search: unknown | null
          rating: number | null
          review_count: number | null
          searchPage_url: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          service_url: string | null
          state: string
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          contact_phone?: string | null
          created_at?: string | null
          description: string
          email?: string | null
          facebook_url?: string | null
          featured?: string | null
          geocoding_error?: string | null
          geocoding_status?: string | null
          gMapsID?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_verified?: boolean | null
          latitude: number
          longitude: number
          name: string
          name_description_search?: unknown | null
          rating?: number | null
          review_count?: number | null
          searchPage_url?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          service_url?: string | null
          state: string
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          email?: string | null
          facebook_url?: string | null
          featured?: string | null
          geocoding_error?: string | null
          geocoding_status?: string | null
          gMapsID?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_verified?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          name_description_search?: unknown | null
          rating?: number | null
          review_count?: number | null
          searchPage_url?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          service_url?: string | null
          state?: string
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      trainers: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          categoryName: string | null
          city: string | null
          description: string | null
          fid: string
          imageUrl: string | null
          "location/lat": number | null
          "location/lng": number | null
          phone: string | null
          postalCode: number | null
          reviewsCount: number | null
          searchPageUrl: string | null
          searchString: string | null
          state: string | null
          street: string | null
          title: string | null
          totalScore: number | null
          url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid?: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          phone?: string | null
          postalCode?: number | null
          reviewsCount?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_interaction_analytics: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          session_id: string
          target_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          session_id: string
          target_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          session_id?: string
          target_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vets: {
        Row: {
          address: string | null
          "categories/0": string | null
          "categories/1": string | null
          "categories/2": string | null
          "categories/3": string | null
          "categories/4": string | null
          "categories/5": string | null
          "categories/6": string | null
          "categories/7": string | null
          categoryName: string | null
          city: string | null
          description: string | null
          fid: string
          imageUrl: string | null
          "location/lat": number | null
          "location/lng": number | null
          "openingHours/0/day": string | null
          "openingHours/0/hours": string | null
          "openingHours/1/day": string | null
          "openingHours/1/hours": string | null
          "openingHours/2/day": string | null
          "openingHours/2/hours": string | null
          "openingHours/3/day": string | null
          "openingHours/3/hours": string | null
          "openingHours/4/day": string | null
          "openingHours/4/hours": string | null
          "openingHours/5/day": string | null
          "openingHours/5/hours": string | null
          "openingHours/6/day": string | null
          "openingHours/6/hours": string | null
          phone: string | null
          postalCode: number | null
          searchPageUrl: string | null
          searchString: string | null
          state: string | null
          street: string | null
          title: string | null
          totalScore: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          "openingHours/0/day"?: string | null
          "openingHours/0/hours"?: string | null
          "openingHours/1/day"?: string | null
          "openingHours/1/hours"?: string | null
          "openingHours/2/day"?: string | null
          "openingHours/2/hours"?: string | null
          "openingHours/3/day"?: string | null
          "openingHours/3/hours"?: string | null
          "openingHours/4/day"?: string | null
          "openingHours/4/hours"?: string | null
          "openingHours/5/day"?: string | null
          "openingHours/5/hours"?: string | null
          "openingHours/6/day"?: string | null
          "openingHours/6/hours"?: string | null
          phone?: string | null
          postalCode?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          "categories/0"?: string | null
          "categories/1"?: string | null
          "categories/2"?: string | null
          "categories/3"?: string | null
          "categories/4"?: string | null
          "categories/5"?: string | null
          "categories/6"?: string | null
          "categories/7"?: string | null
          categoryName?: string | null
          city?: string | null
          description?: string | null
          fid?: string
          imageUrl?: string | null
          "location/lat"?: number | null
          "location/lng"?: number | null
          "openingHours/0/day"?: string | null
          "openingHours/0/hours"?: string | null
          "openingHours/1/day"?: string | null
          "openingHours/1/hours"?: string | null
          "openingHours/2/day"?: string | null
          "openingHours/2/hours"?: string | null
          "openingHours/3/day"?: string | null
          "openingHours/3/hours"?: string | null
          "openingHours/4/day"?: string | null
          "openingHours/4/hours"?: string | null
          "openingHours/5/day"?: string | null
          "openingHours/5/hours"?: string | null
          "openingHours/6/day"?: string | null
          "openingHours/6/hours"?: string | null
          phone?: string | null
          postalCode?: number | null
          searchPageUrl?: string | null
          searchString?: string | null
          state?: string | null
          street?: string | null
          title?: string | null
          totalScore?: number | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_service_submission: {
        Args: { submission_id: string }
        Returns: string
      }
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      can_verify_services: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      cleanup_old_error_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      convert_state_name_to_abbreviation: {
        Args: { full_state_name: string }
        Returns: string
      }
      cube: {
        Args: { "": number[] } | { "": number }
        Returns: unknown
      }
      cube_dim: {
        Args: { "": unknown }
        Returns: number
      }
      cube_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_is_point: {
        Args: { "": unknown }
        Returns: boolean
      }
      cube_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_send: {
        Args: { "": unknown }
        Returns: string
      }
      cube_size: {
        Args: { "": unknown }
        Returns: number
      }
      delete_service_analytics: {
        Args: { service_id: string }
        Returns: undefined
      }
      earth: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      gc_to_sec: {
        Args: { "": number }
        Returns: number
      }
      get_all_user_messages: {
        Args: { user_id: string }
        Returns: {
          id: string
          content: string
          is_read: boolean
          created_at: string
          sender_id: string
          sender_email: string
          sender_pet_name: string
          sender_profile_photo: string
          recipient_id: string
          recipient_email: string
          recipient_pet_name: string
          recipient_profile_photo: string
          is_outgoing: boolean
        }[]
      }
      get_average_rating: {
        Args: { service_id: string }
        Returns: {
          average_rating: number
          review_count: number
        }[]
      }
      get_messages_with_sender: {
        Args: { user_id: string; limit_count?: number; offset_count?: number }
        Returns: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          is_read: boolean
          created_at: string
          updated_at: string
          sender_email: string
          sender_pet_name: string
          sender_profile_photo: string
          sender_pet_photos: string[]
        }[]
      }
      get_service_definition_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          service_definition_id: number
          service_name: string
          service_value: string
          service_description: string
          services_count: number
        }[]
      }
      get_submission_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          service_type: Database["public"]["Enums"]["service_type"]
          count: number
        }[]
      }
      get_unread_message_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_user_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          role: string
          pet_name: string
          created_at: string
        }[]
      }
      get_user_email: {
        Args: { user_id: string }
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_admin_privileges: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      latitude: {
        Args: { "": unknown }
        Returns: number
      }
      longitude: {
        Args: { "": unknown }
        Returns: number
      }
      mark_message_read: {
        Args: { message_id: string }
        Returns: undefined
      }
      sec_to_gc: {
        Args: { "": number }
        Returns: number
      }
      send_message: {
        Args: { to_user_id: string; message_content: string }
        Returns: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          updated_at: string | null
        }
      }
      services_within_radius: {
        Args: { p_lat: number; p_lon: number; p_radius_miles?: number }
        Returns: {
          address: string
          city: string
          contact_phone: string | null
          created_at: string | null
          description: string
          email: string | null
          facebook_url: string | null
          featured: string | null
          geocoding_error: string | null
          geocoding_status: string | null
          gMapsID: string | null
          id: string
          image_url: string | null
          instagram_url: string | null
          is_verified: boolean | null
          latitude: number
          longitude: number
          name: string
          name_description_search: unknown | null
          rating: number | null
          review_count: number | null
          searchPage_url: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          service_url: string | null
          state: string
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
          zip_code: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      update_profile_metadata: {
        Args: { profile_data: Json }
        Returns: {
          accept_titer_exemption: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          open_to_public: boolean | null
          pet_breed: string | null
          pet_favorite_tricks: string[] | null
          pet_name: string | null
          pet_photos: string[] | null
          profile_photo: string | null
          role: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
      }
      update_user_role: {
        Args: { user_id: string; new_role: string }
        Returns: undefined
      }
      verify_service: {
        Args: { service_id: string }
        Returns: undefined
      }
    }
    Enums: {
      contact_status: "new" | "read" | "replied" | "archived"
      service_category:
        | "dog_parks"
        | "groomers"
        | "veterinarians"
        | "contractors"
        | "dog_trainers"
      service_type:
        | "dog_park"
        | "groomer"
        | "veterinarian"
        | "contractor"
        | "dog_trainer"
        | "daycare"
        | "dog_sitter"
        | "dog_walker"
        | "landscape_contractor"
        | "apartments"
      submission_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_status: ["new", "read", "replied", "archived"],
      service_category: [
        "dog_parks",
        "groomers",
        "veterinarians",
        "contractors",
        "dog_trainers",
      ],
      service_type: [
        "dog_park",
        "groomer",
        "veterinarian",
        "contractor",
        "dog_trainer",
        "daycare",
        "dog_sitter",
        "dog_walker",
        "landscape_contractor",
        "apartments",
      ],
      submission_status: ["pending", "approved", "rejected"],
    },
  },
} as const
