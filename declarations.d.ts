declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}
declare module 'react-native-dropdown-picker';
declare module 'react-native-animated-splash-screen';
declare module '*.jpeg' {
  const value: any;
  export default value;
}
declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module 'react-native-branch' {
  // https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution#content-schema
  export type ContentSchema =
    | 'COMMERCE_AUCTION'
    | 'COMMERCE_BUSINESS'
    | 'COMMERCE_OTHER'
    | 'COMMERCE_PRODUCT'
    | 'COMMERCE_RESTAURANT'
    | 'COMMERCE_SERVICE'
    | 'COMMERCE_TRAVEL_FLIGHT'
    | 'COMMERCE_TRAVEL_HOTEL'
    | 'COMMERCE_TRAVEL_OTHER'
    | 'GAME_STATE'
    | 'MEDIA_IMAGE'
    | 'MEDIA_MIXED'
    | 'MEDIA_MUSIC'
    | 'MEDIA_OTHER'
    | 'MEDIA_VIDEO'
    | 'OTHER'
    | 'TEXT_ARTICLE'
    | 'TEXT_BLOG'
    | 'TEXT_OTHER'
    | 'TEXT_RECIPE'
    | 'TEXT_REVIEW'
    | 'TEXT_SEARCH_RESULTS'
    | 'TEXT_STORY'
    | 'TEXT_TECHNICAL_DOC';

  // https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution#condition
  export type Condition =
    | 'OTHER'
    | 'EXCELLENT'
    | 'NEW'
    | 'GOOD'
    | 'FAIR'
    | 'POOR'
    | 'USED'
    | 'REFURBISHED';

  // https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution#product-category
  export type ProductCategory =
    | 'Animals & Pet Supplies'
    | 'Apparel & Accessories'
    | 'Arts & Entertainment'
    | 'Baby & Toddler'
    | 'Business & Industrial'
    | 'Cameras & Optics'
    | 'Electronics'
    | 'Food, Beverages & Tobacco'
    | 'Furniture'
    | 'Hardware'
    | 'Health & Beauty'
    | 'Home & Garden'
    | 'Luggage & Bags'
    | 'Mature'
    | 'Media'
    | 'Office Supplies'
    | 'Religious & Ceremonial'
    | 'Software'
    | 'Sporting Goods'
    | 'Toys & Games'
    | 'Vehicles & Parts';

  // https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution#branch-universal-object-content-metadata
  export type ContentMetadata = {
    contentSchema?: ContentSchema;
    quantity?: number;
    price?: string | number;
    currency?: string;
    sku?: string;
    productName?: string;
    productBrand?: string;
    productCategory?: ProductCategory;
    productVariant?: string;
    condition?: Condition;
    ratingAverage?: number;
    ratingCount?: number;
    ratingMax?: number;
    addressStreet?: string;
    addressCity?: string;
    addressRegion?: string;
    addressCountry?: string;
    addressPostalCode?: string;
    latitude?: number;
    longitude?: number;
    imageCaptions?: Array<string>;
    customMetadata?: Record<string, string>;
  };

  // https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution#branch-universal-object-properties
  export type UniversalObjectOptions = {
    canonicalIdentifier?: string;
    contentDescription?: string;
    contentImageUrl?: string;
    contentMetadata?: ContentMetadata;
    //  UTC expiration date, e.g. 2018-02-01T00:00:00
    expirationDate?: string;
    keywords?: Array<string>;
    locallyIndex?: boolean;
    price?: number;
    publiclyIndex?: boolean;
    title?: string;
  };

  export type BranchUniversalObject = {
    // TODO
    ident: any;
    showShareSheet(
      shareOptions?: {},
      linkProperties?: {},
      controlParams?: {},
    ): // TODO
    any;
    generateShortUrl(linkProperties?: {}, controlParams?: {}): any;
    logEvent(): any;
    release(): any;
  };

  const BranchInstance: {
    createBranchUniversalObject(
      identifier: string,
      options: UniversalObjectOptions,
    ): Promise<BranchUniversalObject>;

    redeemRewards(amount: any, bucket: any): any;
    loadRewards(bucket: any): any;
    getCreditHistory: Function;

    openURL(url: string, options?: {}): any;

    getLatestReferringParams(synchronous?: boolean): any;
    getFirstReferringParams: Function;
    setIdentity(identity: string): void;
    logout(): void;
    userCompletedAction(event: any, state?: {}): any;
    getShortUrl: Function;

    disableTracking(disable: boolean): void;

    isTrackingDisabled(): Promise<boolean>;
    skipCachedEvents(): void;

    subscribe(listener: Function): () => void;
  };

  export interface StaticBranchEvents {
    AddToCart: string;
    AddToWishlist: string;
    ViewCart: string;
    InitiatePurchase: string;
    AddPaymentInfo: string;
    Purchase: string;
    SpendCredits: string;
    Search: string;
    ViewItem: string;
    ViewItems: string;
    Rate: string;
    Share: string;
    CompleteRegistration: string;
    CompleteTutorial: string;
    AchieveLevel: string;
    UnlockAchievement: string;
  }

  export type BranchEventParams = {
    affiliation?: string;
    coupon?: string;
    currency?: string;
    customData?: {};
    description?: string;
    revenue?: string | number;
    searchQuery?: string;
    shipping?: string | number;
    tax?: string | number;
    transactionID?: string;
  };

  export type ContentItem = {
    ident: any;
  };

  export class BranchEvent {
    constructor(
      branchEvent: string,
      contentItems?: Array<ContentItem>,
      params?: BranchEventParams,
    );

    logEvent(): Promise<any>;

    static AddToCart: string;
    static AddToWishlist: string;
    static ViewCart: string;
    static InitiatePurchase: string;
    static AddPaymentInfo: string;
    static Purchase: string;
    static SpendCredits: string;
    static Search: string;
    static ViewItem: string;
    static ViewItems: string;
    static Rate: string;
    static Share: string;
    static CompleteRegistration: string;
    static CompleteTutorial: string;
    static AchieveLevel: string;
    static UnlockAchievement: string;
  }

  export default BranchInstance;
}
