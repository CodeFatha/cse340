INSERT INTO public.account("account_firstname", "account_lastname", "account_email", "account_password")
VALUES ('Tony', 'Stark', 'tony@starkent', 'Iam1ronM@n')

UPDATE public.account SET account_type = 'Admin' where account_id = 2

DELETE FROM public.account WHERE account_id = 2

UPDATE public.inventory 
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10

SELECT * FROM public.inventory inv
INNER JOIN public.classification cls 
ON inv.inv_model = cls.classification_name

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles');



