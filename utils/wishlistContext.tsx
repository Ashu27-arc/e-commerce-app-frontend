import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem("wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const saveWishlist = async (newWishlist: WishlistItem[]) => {
    try {
      await AsyncStorage.setItem("wishlist", JSON.stringify(newWishlist));
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  };

  const addToWishlist = (product: any) => {
    setWishlist((prevWishlist) => {
      const existingItem = prevWishlist.find((item) => item._id === product._id);

      if (existingItem) {
        return prevWishlist;
      }

      const newWishlist = [...prevWishlist, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      }];

      saveWishlist(newWishlist);
      return newWishlist;
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prevWishlist) => {
      const newWishlist = prevWishlist.filter((item) => item._id !== id);
      saveWishlist(newWishlist);
      return newWishlist;
    });
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item._id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
    saveWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
