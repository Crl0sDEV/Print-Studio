import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AddPresetModal } from './add-preset-modal'
import { AddPricingModal } from './add-pricing-modal'

export function PresetsCatalog({ presets, shopId }: { presets: any[] | null; shopId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h2 className="text-xl font-bold">Shop Presets Catalog</h2>
          <p className="text-sm text-muted-foreground">
            Mga ready-made sizes and printing settings para sa shop mo
          </p>
        </div>
        <AddPresetModal shopId={shopId} />
      </div>

      {!presets || presets.length === 0 ? (
        <Card className="space-y-3 border-border/40 bg-card/40 p-8 text-center">
          <p className="text-muted-foreground">
            Wala ka pang active presets. Mag-add ng ID sizes o Bond Paper settings!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presets.map((preset) => (
            <Card
              key={preset.id}
              className="border-border/40 bg-card/60 transition-all hover:border-primary/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs uppercase text-primary">
                    {preset.category}
                  </span>
                  {preset.width_inches && preset.height_inches && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {preset.width_inches}" × {preset.height_inches}"
                    </span>
                  )}
                </div>
                <CardTitle className="mt-2 text-lg">{preset.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {preset.description || preset.paper_type}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-2 flex items-center justify-between border-t border-border/20 pt-3 text-xs text-muted-foreground">
                <span>
                  Paper: <strong className="text-foreground">{preset.paper_type || 'Standard'}</strong>
                </span>
                <span className="font-semibold text-primary">
                  {preset.default_side_option}
                </span>
              </CardContent>
              <div className="px-6 pb-4">
                <AddPricingModal presetId={preset.id} shopId={shopId} presetName={preset.name} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
