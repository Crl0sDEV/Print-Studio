'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NametagConfig } from '@/types/studio'

interface NametagGeneratorControlsProps {
  nametag: NametagConfig
  onChangeNametag: (newNametag: NametagConfig) => void
}

export function NametagGeneratorControls({ nametag, onChangeNametag }: NametagGeneratorControlsProps) {
  return (
    <Card className="p-4 border-border/40 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">CSC / PRC Nametag</h3>
          <p className="text-xs text-muted-foreground">Standard bottom nameplate overlay</p>
        </div>
        <Button
          size="sm"
          variant={nametag.enabled ? 'default' : 'outline'}
          className="text-xs h-7"
          onClick={() => onChangeNametag({ ...nametag, enabled: !nametag.enabled })}
        >
          {nametag.enabled ? 'Nametag ON' : 'Nametag OFF'}
        </Button>
      </div>

      {nametag.enabled && (
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs">Full Name (SURNAME, FIRST NAME M.I.)</Label>
            <Input
              value={nametag.fullName}
              onChange={(e) => onChangeNametag({ ...nametag, fullName: e.target.value })}
              placeholder="DELA CRUZ, JUAN M."
              className="h-8 text-xs font-semibold uppercase font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Optional Title / Designation</Label>
            <Input
              value={nametag.designation || ''}
              onChange={(e) => onChangeNametag({ ...nametag, designation: e.target.value })}
              placeholder="ADMINISTRATIVE OFFICER II"
              className="h-8 text-xs font-mono uppercase"
            />
          </div>

          <div className="p-2.5 bg-secondary/30 rounded-lg text-[11px] text-muted-foreground leading-snug">
            Follows CSC Standard: White rectangular background with crisp black border and bold capitalized typography.
          </div>
        </div>
      )}
    </Card>
  )
}
