class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    @user.valid?
    if !@user.is_email?
      flash[:alert] = "Input a properly formatted email."
      redirect_to :back
    elsif @user.errors.messages[:email] != nil
      flash[:notice]= "That email " + @user.errors.messages[:email].first
      redirect_to :back
    elsif @user.save
      flash[:notice]= "Signup successful. Welcome to the site!"
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      flash[:alert] = "There was a problem creating your account. Please try again."
      redirect_to :back
    end
  end

  def new
  end

  def show
    @users = User.all
    @user = User.find(params[:id])
    @tag = Tag.new
    @comment = Comment.new
    @photos = current_user.photos

    # Get photos from users that the current user follows
    follows = current_user.followed_users
    follows.each do |followed_user|
      @photos += followed_user.photos
    end
    @photos = @photos.sort_by(&:created_at).reverse
  end

  def view_all_users
    @users = User.all
  end

  def follow
    user_to_follow = User.find(params[:id])
    existing_follow = Follow.find_by(follower_id: current_user.id, followed_id: params[:id])

    if existing_follow.nil? # Only create follow if it doesn't exist
      Follow.create(follower_id: current_user.id, followed_id: params[:id])
      flash[:notice] = "You are now following #{user_to_follow.email}"
    else
      flash[:alert] = "You are already following #{user_to_follow.email}"
    end
    redirect_to view_all_users_users_path
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :avatar)
  end
end
