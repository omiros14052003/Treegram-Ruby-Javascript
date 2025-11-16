class CreateFollows < ActiveRecord::Migration
  def change
    create_table :follows do |t|
      t.references :follower, foreign_key: true
      t.references :followed, foreign_key: true
    end
  end
end
