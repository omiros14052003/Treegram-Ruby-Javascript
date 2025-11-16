class PhotosController < ApplicationController
  def create
    @user = User.find(params[:user_id])
    if params[:photo] == nil

      flash[:alert] = "Please upload a photo"
      redirect_to :back
    else
    @photo = Photo.create(photo_params)
      @photo.user_id = @user.id
      @photo.save
      if photo_params[:title] == ""
        flash[:notice] = "Failed to upload a photo"
      else
        flash[:notice] = "Successfully uploaded a photo"
      end
      redirect_to user_path(@user)
    end
  end

  def new
    @user = User.find(params[:user_id])
    @photo = Photo.create()
  end

  def destroy
      @photo_to_delete = Photo.find(params[:id])
      @photo_to_delete.destroy
      redirect_to user_path(session[:user_id])
  end


  private
  def photo_params
    params.require(:photo).permit(:image, :title)
  end
end
