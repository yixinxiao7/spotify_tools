export interface URL {
    spotify?: string
    url?: string
}

export interface ExternalID {
    isrc: string
}

export interface Image {
    height: number
    width: number
    url: string
}

export interface LoggedUser {
    country: string
    display_name: string
    email: string
    explicit_content: any
    external_urls: URL
    followers: any
    href: string
    id: string
    images: Image[]
    product: string
    type: string
    uri: string
}
export interface User {
    id: string
    external_urls?: URL
    display_name?: string
    spotify?: string
    href: string
    type: string
    uri: string
}

export interface Artist {
    id: string
    name: string
    type: string
    uri: string
    href: string
    external_urls: URL    
}


export interface AllPlaylists {
    href: string
    items: PlaylistGeneralEntry[]
    limit: number
    next?: string
    offset: number
    previous?: string
    total: number
}


export interface Playlist {
    href: string
    items: PlaylistEntry[]
    limit: number
    next?: string
    offset: number
    previous?: string
    total: number
}

export interface PlaylistGeneralEntry {
    collaborative: boolean
    description: string
    external_urls: URL
    href: string
    id: string
    images: Image[]
    name: string
    owner: User
    primary_color: any
    public: boolean
    snapshot_id: string
    tracks: any
    type: string
    uri: string
}

export interface PlaylistEntry {
    added_at: string
    added_by: User
    is_local: boolean
    primary_color?: string
    track: Track
    video_thumbnail: URL
}

export interface Album {
    id: string
    name: string
    album_type: string
    artists: Artist[]
    available_markets: string[]
    exernal_urls: URL
    href: string
    images: Image[]
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
}

export interface Track {
    id: string
    name: string
    album: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: ExternalID
    external_urls: URL
    href: string
    is_local: boolean
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
}