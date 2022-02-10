import Realm, { ObjectSchema, ObjectType } from 'realm';
import { GpsPointsInput } from '~/graphql/autogenerate/schemas';

export interface IDataCompiledSchema {
  _id: string;
  userId: string;
  viewWelcomeScreen: boolean | null | undefined;
  integratedWithAppleHealth: boolean;
  integratedWithStravaCrawler: boolean;
  integratedWithGarmin: boolean;
  integratedWithPolar: boolean;
  hasCompany: boolean;
  verifiedPhone: boolean;
  lastUploadAppleHealth: Date;
  lastUploadPolar?: Date | null;
  lastUploadGarmin?: Date | null;
  lastPlatformUsed?: string | null;
  lastAppVersionUsed?: string | null;
  lastDeviceUsed?: string | null;
  lastTimeUsed?: string | null;
  integratedWithStrava?: boolean;
}

const DataCompiledSchema = {
  name: 'CompiledData',
  properties: {
    _id: 'string',
    userId: 'string',
    viewWelcomeScreen: 'bool?',
    integratedWithAppleHealth: 'bool',
    integratedWithStravaCrawler: 'bool',
    integratedWithGarmin: 'bool',
    integratedWithPolar: 'bool',
    hasCompany: 'bool',
    verifiedPhone: 'bool',
    lastUploadAppleHealth: 'date?',
    lastUploadPolar: 'date?',
    lastUploadGarmin: 'date?',
    lastPlatformUsed: 'string?',
    lastAppVersionUsed: 'string?',
    lastDeviceUsed: 'string?',
    lastTimeUsed: 'string?',
    integratedWithStrava: 'bool',
  },
  primaryKey: '_id',
};

export interface IProfileSchema {
  id: string;
  username: string;
  followers_count: number;
  following_count: number;
  official: boolean;
  profile_avatar: string;
  profile_cover: string;
  description: string;
  user_id: string;
  company_id: string;
  is_follower: boolean;
}

const ProfileSchema = {
  name: 'Profile',
  properties: {
    id: 'string',
    username: 'string',
    followers_count: 'float',
    following_count: 'float',
    official: 'bool',
    profile_avatar: 'string?',
    profile_cover: 'string?',
    description: 'string?',
    user_id: 'string',
    company_id: 'string',
    is_follower: 'bool?',
  },
  primaryKey: 'id',
};

export interface IUserSchema {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  stature: number;
  weight: number;
  phone: string;
  date_of_birth: string;
  has_social_login: boolean;
  city_id: string;
  active: boolean;
  address_line_one: string;
  address_line_two: string;
  street_number: string;
  legal_registry_number: string;
  zip_code: string;
  strava_permission_activities: boolean;
  staff: boolean;
  blacklist: boolean;
  activities_count: number;
  profile?: IProfileSchema;
  team_name?: string;
}

const UserSchema: ObjectSchema = {
  name: 'User',
  properties: {
    id: 'string',
    firstname: 'string',
    lastname: 'string',
    email: 'string',
    gender: 'string',
    stature: 'float',
    weight: 'float',
    phone: 'string',
    date_of_birth: 'string',
    has_social_login: 'bool',
    city_id: 'string',
    active: 'bool',
    address_line_one: 'string',
    address_line_two: 'string',
    street_number: 'string',
    legal_registry_number: 'string?',
    zip_code: 'string',
    strava_permission_activities: 'bool',
    staff: 'bool',
    blacklist: 'bool',
    activities_count: 'float',
    profile: 'Profile?',
    team_name: 'string?',
  },
  primaryKey: 'id',
};

export interface IDashboardSchema {
  id: string;
  content: string;
  updated_at: string;
}

const Dashboard: ObjectSchema = {
  name: 'Dashboard',
  properties: {
    id: 'string',
    content: 'string',
    updated_at: 'date',
  },
  primaryKey: 'id',
};

export interface IMonitorSchema {
  id: string;
  coordinates: GpsPointsInput[];
  polyline: string;
  distance: number;
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  end_date: string;
  total_elevation_gain?: number;
  total_ascent?: number;
  total_descent?: number;
  name: string;
  description?: string;
  device_name: string;
  visibility?: string;
  is_private: boolean;
  elevations: number[];
  speeds?: number[];
  last_date_updated: string;
  last_moving_time: number;
}

export interface ICoodinateSchema {
  coordinates: number[];
  speed: number;
  time: string;
}

const CoordinateSchema: ObjectSchema = {
  name: 'Coordinates',
  properties: {
    coordinates: 'float[]',
    speed: 'float',
    time: 'string',
  },
};

const MonitorSchema: ObjectSchema = {
  name: 'Activity',
  properties: {
    id: 'string',
    coordinates: { type: 'list', objectType: 'Coordinates' },
    polyline: 'string',
    distance: 'float',
    elapsed_time: 'float',
    moving_time: 'float',
    start_date: 'date',
    total_elevation_gain: 'float?',
    total_ascent: 'float?',
    total_descent: 'float?',
    name: 'string',
    end_date: 'date?',
    description: 'string?',
    device_name: 'string',
    visibility: 'string?',
    is_private: 'bool',
    last_date_updated: 'date',
    last_moving_time: 'float',
  },
  primaryKey: 'id',
};

const MonitorQueueSchema: ObjectSchema = {
  name: 'ActivityQueue',
  properties: {
    id: 'string',
    coordinates: { type: 'list', objectType: 'Coordinates' },
    polyline: 'string',
    distance: 'float',
    elapsed_time: 'float',
    moving_time: 'float',
    start_date: 'date',
    end_date: 'date?',
    total_elevation_gain: 'float?',
    total_ascent: 'float?',
    total_descent: 'float?',
    name: 'string',
    description: 'string?',
    device_name: 'string',
    visibility: 'string?',
    is_private: 'bool',
    send_to_strava: 'bool',
  },
  primaryKey: 'id',
};

export interface IChallengesOfflineSchema {
  id: string;
  content: string;
  updated_at: string;
}

const ChallengesOffline: ObjectSchema = {
  name: 'ChallengesOffline',
  properties: {
    id: 'string',
    content: 'string',
    updated_at: 'date',
  },
  primaryKey: 'id',
};

const AppleHealthActivities: ObjectSchema = {
  name: 'AppleActivity',
  properties: {
    id: 'string',
    startDate: 'string',
    endDate: 'string',
    distance: 'float',
    send: 'bool',
  },
  primaryKey: 'id',
};

export interface IAppleHealthActivitiesSchema {
  id: string;
  startDate: string;
  endDate: string;
  distance: number;
  send: boolean;
}

const EventPointSchema = {
  name: 'EventPoints',
  properties: {
    id: 'string',
    challengeId: 'string',
    pointId: 'string',
    checkTime: 'string',
    latitude: 'float',
    longitude: 'float',
    userCheck: 'bool',
    userShortId: 'string',
  },
  primaryKey: 'id',
};
export interface IEventPointSchema {
  id: string;
  challengeId: string;
  pointId: string;
  checkTime: string;
  latitude: number;
  longitude: number;
  userCheck: boolean;
  userShortId: string;
}
const dbEventPoints = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'eventPoints',
    schema: [EventPointSchema],
    schemaVersion: 2,
    migration: (oldRealm, newRealm) => {},
  });

  return realm;
};

const EventPointsOffline: ObjectSchema = {
  name: 'EventPointsOffline',
  properties: {
    id: 'string',
    content: 'string',
    updated_at: 'date',
  },
  primaryKey: 'id',
};
export interface IEventPointsOfflineSchema {
  id: string;
  content: string;
  updated_at: string;
}
const dbEventPointsOffline = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'eventOffline',
    schema: [EventPointsOffline],
    schemaVersion: 1,
    migration: (oldRealm, newRealm) => {},
  });

  return realm;
};

const EventPointsAdminstrationOffline: ObjectSchema = {
  name: 'EventPointsAdminOffline',
  properties: {
    id: 'string',
    count: 'float',
  },
  primaryKey: 'id',
};
export interface IEventPointsAdminstrationOffline {
  id: string;
  count: number;
}
const dbEventPointsAdminstrationOffline = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'eventAdmin',
    schema: [EventPointsAdminstrationOffline],
    schemaVersion: 1,
    migration: (oldRealm, newRealm) => {},
  });

  return realm;
};

const dbCLient = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'localData',
    schema: [DataCompiledSchema, ProfileSchema, UserSchema],
    schemaVersion: 4,
    migration: (oldRealm, newRealm) => {},
  });

  return realm;
};

const dbMonitor = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'monitorActivity',
    schema: [MonitorSchema, CoordinateSchema],
    schemaVersion: 3,
    migration: (oldRealm, newRealm) => {},
  });

  return realm;
};

const dbMonitorQueue = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'monitorActivityQueue',
    schema: [CoordinateSchema, MonitorQueueSchema],
  });

  return realm;
};

const dbDashboard = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'dashboard',
    schema: [Dashboard],
  });

  return realm;
};

const dbChallenges = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'challenges',
    schema: [ChallengesOffline],
  });

  return realm;
};

const dbActivities = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'healthActivities',
    schema: [AppleHealthActivities],
  });

  return realm;
};

export interface IPaymentsSchema {
  id: string;
  content: string;
  updated_at: string;
}

const Payments: ObjectSchema = {
  name: 'Payments',
  properties: {
    id: 'string',
    content: 'string',
    updated_at: 'date',
  },
  primaryKey: 'id',
};

const dbPayments = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'payments',
    schema: [Payments],
  });

  return realm;
};

export interface ILineMapSchema {
  id: string;
  coordinates: number[][];
  lineString: string;
}

const LineMap: ObjectSchema = {
  name: 'LineMap',
  properties: {
    id: 'string',
    coordinates: 'float[][]',
    lineString: 'string',
  },
  primaryKey: 'id',
};

const dbLineMap = async (): Promise<Realm> => {
  const realm = await Realm.open({
    path: 'linemap',
    schema: [LineMap],
  });

  return realm;
};

export {
  dbLineMap,
  dbPayments,
  dbCLient,
  dbMonitor,
  dbMonitorQueue,
  dbDashboard,
  dbChallenges,
  dbActivities,
  dbEventPoints,
  dbEventPointsOffline,
  dbEventPointsAdminstrationOffline,
};
