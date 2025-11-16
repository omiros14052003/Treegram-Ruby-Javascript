class CommentsController < ApplicationController
    def new
    end

    def create
        @new_comment = Comment.create({ photo_id: params[:comment][:photo_id], user_id: params[:comment][:user_id], comment_text: params[:comment][:comment_text] })
        redirect_to user_path(session[:user_id])
    end

    def destroy
        @comment_to_delete = Comment.find(params[:id])
        @comment_to_delete.destroy
        redirect_to user_path(session[:user_id])
    end
end
