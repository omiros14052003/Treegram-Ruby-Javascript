Rails.application.routes.draw do
  get '/' => 'home#index'
  resources :users do
    collection do
      get 'view_all_users'
    end
    resources :photos
  end

  resources :users do
    member do
      post 'follow'
    end
  end

  resources :photos do
    member do
      delete 'destroy'
    end
  end

  resources :comments, only: [:create, :destroy]

  resources :tags, only: [:create, :destroy]
  get '/log-in' => "sessions#new"
  post '/log-in' => "sessions#create"
  get '/log-out' => "sessions#destroy", as: :log_out

end
