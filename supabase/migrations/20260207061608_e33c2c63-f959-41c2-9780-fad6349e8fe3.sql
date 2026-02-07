-- Allow approved committee members to update user_roles (approve/reject)
CREATE POLICY "Committee members can update roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'committee_member'::app_role))
WITH CHECK (has_role(auth.uid(), 'committee_member'::app_role));