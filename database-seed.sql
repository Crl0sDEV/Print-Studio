-- Run this directly in your Supabase SQL Editor

DO $$
DECLARE
    target_shop_id UUID;
    preset_id UUID;
BEGIN
    SELECT id INTO target_shop_id FROM shops LIMIT 1;
    
    IF target_shop_id IS NULL THEN
        RAISE EXCEPTION 'No shop found.';
    END IF;

    -- ==========================================
    -- 1. Document: Short (Letter) Bond Paper
    -- ==========================================
    INSERT INTO presets (id, shop_id, name, category, paper_type, width_inches, height_inches, default_side_option, is_active)
    VALUES (gen_random_uuid(), target_shop_id, 'Short Bond Paper (Letter)', 'document', '70gsm Bond Paper', 8.5, 11, 'one_sided', true)
    RETURNING id INTO preset_id;
    
    INSERT INTO pricing_matrices (shop_id, preset_id, name, unit, color_mode, min_quantity, max_quantity, unit_price)
    VALUES 
        (target_shop_id, preset_id, 'BW 1-49', 'per_page', 'grayscale', 1, 49, 3.00),
        (target_shop_id, preset_id, 'BW 50-99', 'per_page', 'grayscale', 50, 99, 2.50),
        (target_shop_id, preset_id, 'BW 100+', 'per_page', 'grayscale', 100, NULL, 2.00),
        (target_shop_id, preset_id, 'Color 1-49', 'per_page', 'colored_heavy', 1, 49, 10.00),
        (target_shop_id, preset_id, 'Color 50+', 'per_page', 'colored_heavy', 50, NULL, 8.00);

    -- ==========================================
    -- 2. Document: Long (Folio) Bond Paper
    -- ==========================================
    INSERT INTO presets (id, shop_id, name, category, paper_type, width_inches, height_inches, default_side_option, is_active)
    VALUES (gen_random_uuid(), target_shop_id, 'Long Bond Paper (Folio)', 'document', '70gsm Bond Paper', 8.5, 13, 'one_sided', true)
    RETURNING id INTO preset_id;
    
    INSERT INTO pricing_matrices (shop_id, preset_id, name, unit, color_mode, min_quantity, max_quantity, unit_price)
    VALUES 
        (target_shop_id, preset_id, 'BW 1-49', 'per_page', 'grayscale', 1, 49, 4.00),
        (target_shop_id, preset_id, 'BW 50+', 'per_page', 'grayscale', 50, NULL, 3.00),
        (target_shop_id, preset_id, 'Color 1-49', 'per_page', 'colored_heavy', 1, 49, 12.00),
        (target_shop_id, preset_id, 'Color 50+', 'per_page', 'colored_heavy', 50, NULL, 10.00);

    -- ==========================================
    -- 3. ID Pictures: 1x1 Package
    -- ==========================================
    INSERT INTO presets (id, shop_id, name, category, paper_type, width_inches, height_inches, default_side_option, is_active)
    VALUES (gen_random_uuid(), target_shop_id, '1x1 ID Picture (Set of 6)', 'id_card', 'Glossy Photo Paper', 1, 1, 'one_sided', true)
    RETURNING id INTO preset_id;
    
    INSERT INTO pricing_matrices (shop_id, preset_id, name, unit, color_mode, min_quantity, max_quantity, unit_price)
    VALUES (target_shop_id, preset_id, 'Standard Set', 'flat_rate', 'colored_heavy', 1, NULL, 50.00);

    -- ==========================================
    -- 4. ID Pictures: 2x2 Package
    -- ==========================================
    INSERT INTO presets (id, shop_id, name, category, paper_type, width_inches, height_inches, default_side_option, is_active)
    VALUES (gen_random_uuid(), target_shop_id, '2x2 ID Picture (Set of 4)', 'id_card', 'Glossy Photo Paper', 2, 2, 'one_sided', true)
    RETURNING id INTO preset_id;
    
    INSERT INTO pricing_matrices (shop_id, preset_id, name, unit, color_mode, min_quantity, max_quantity, unit_price)
    VALUES (target_shop_id, preset_id, 'Standard Set', 'flat_rate', 'colored_heavy', 1, NULL, 60.00);

    -- ==========================================
    -- 5. Marketing: Calling Cards
    -- ==========================================
    INSERT INTO presets (id, shop_id, name, category, paper_type, width_inches, height_inches, default_side_option, is_active)
    VALUES (gen_random_uuid(), target_shop_id, 'Calling Card (Box of 100pcs)', 'merchandise', 'C2S 220lbs', 3.5, 2, 'two_sided', true)
    RETURNING id INTO preset_id;
    
    INSERT INTO pricing_matrices (shop_id, preset_id, name, unit, color_mode, min_quantity, max_quantity, unit_price)
    VALUES (target_shop_id, preset_id, 'Full Box', 'flat_rate', 'colored_heavy', 1, NULL, 250.00);

    -- ==========================================
    -- 6. Large Format: Tarpaulin
    -- ==========================================
    INSERT INTO presets (id, shop_id, name, category, paper_type, width_inches, height_inches, default_side_option, is_active)
    VALUES (gen_random_uuid(), target_shop_id, 'Tarpaulin (Per Sq. Ft.)', 'large_format', '10oz Tarp', NULL, NULL, 'one_sided', true)
    RETURNING id INTO preset_id;
    
    INSERT INTO pricing_matrices (shop_id, preset_id, name, unit, color_mode, min_quantity, max_quantity, unit_price)
    VALUES 
        (target_shop_id, preset_id, 'Tarp 1-49 sqft', 'per_sqft', 'colored_heavy', 1, 49, 15.00),
        (target_shop_id, preset_id, 'Tarp 50+ sqft', 'per_sqft', 'colored_heavy', 50, NULL, 12.00);

END $$;
