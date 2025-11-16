class CreateComment < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.references :photo, foreign_key: true
      t.references :user, foreign_key: true
      t.text :comment_text
    end
  end
end
