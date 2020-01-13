---- Queries Needed for the project


--- Insert new User
INSERT INTO users (email,password)
VALUES ("$email_entered", "$password_entered");

--- Update user profile
UPDATE users
SET email = '$ new email', password = '$new_password', first_name = '$new_firstname', last_name = '$last_name', phone_number ='$new_number'
WHERE id = '$ id updated'  ---and user_id = "$good_user" and list_id = "$good_list"

--- Delete User
DELETE FROM users
WHERE id = '$ id to delete';

--- Insert new item
INSERT INTO items (user_id,list_id,item)
VALUES ("$good_user", "$good_list", '$ value entered');

--- Edit item on the list
UPDATE items
SET name = '$ new name', description = '$ new description' , list_id = '$ updated list'
WHERE id = '$ id updated'  ---and user_id = "$good_user" and list_id = "$good_list"

--- Delete item on the list
DELETE FROM items
WHERE id = '$ id updated';

--- Completed item on the list
UPDATE items
SET date_completed = now()
WHERE id = '$ id updated'  ---and user_id = "$good_user" and list_id = "$good_list"

--- Show list
SELECT a.item, a.description, date_trunc('date',a.date_added)
FROM items as a
JOIN lists_type as b  on a.list_id = b.id
WHERE a.date_completed is null and user_id = "$good_user" and list_id = "$good_list"




